import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { config } from "@/config";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search, BarChart3 } from "lucide-react";
import Layout from "@/components/Layout";

const Admin = () => {
  const { user, setUser, logout, isLoading } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [statistics, setStatistics] = useState<any>(null);

  // Data states
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    loadStatistics();
    loadData();
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [activeTab, searchQuery]);

  const getToken = () => localStorage.getItem("token");

  const loadStatistics = async () => {
    try {
      const response = await fetch(config.endpoints.admin.statistics, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  const loadData = async () => {
    const token = getToken();
    if (!token) return;

    try {
      let endpoint = "";
      switch (activeTab) {
        case "users":
          endpoint = `${config.endpoints.admin.users}?search=${encodeURIComponent(searchQuery)}`;
          break;
        case "events":
          endpoint = `${config.endpoints.admin.events}?search=${encodeURIComponent(searchQuery)}`;
          break;
        case "orders":
          endpoint = `${config.endpoints.admin.orders}?search=${encodeURIComponent(searchQuery)}`;
          break;
        case "payments":
          endpoint = `${config.endpoints.admin.payments}?search=${encodeURIComponent(searchQuery)}`;
          break;
        case "reviews":
          endpoint = `${config.endpoints.admin.reviews}?search=${encodeURIComponent(searchQuery)}`;
          break;
        case "messages":
          endpoint = `${config.endpoints.admin.contactMessages}?search=${encodeURIComponent(searchQuery)}`;
          break;
      }

      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Loaded ${activeTab}:`, data); // Debug log
        
        // Нормализуем данные - конвертируем заглавные буквы в строчные
        const normalizeData = (items: any[]) => {
          return items.map((item: any) => {
            const normalized: any = {};
            for (const key in item) {
              // Конвертируем первую букву в строчную
              const normalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
              normalized[normalizedKey] = item[key];
            }
            return normalized;
          });
        };
        
        switch (activeTab) {
          case "users":
            setUsers(Array.isArray(data) ? normalizeData(data) : []);
            break;
          case "events":
            setEvents(Array.isArray(data) ? normalizeData(data) : []);
            break;
          case "orders":
            setOrders(Array.isArray(data) ? normalizeData(data) : []);
            break;
          case "payments":
            setPayments(Array.isArray(data) ? normalizeData(data) : []);
            break;
          case "reviews":
            setReviews(Array.isArray(data) ? normalizeData(data) : []);
            break;
          case "messages":
            setContactMessages(Array.isArray(data) ? normalizeData(data) : []);
            break;
        }
      } else if (response.status === 403) {
        toast.error("Доступ запрещен");
        logout();
        navigate("/signin");
      } else {
        const errorText = await response.text();
        console.error(`Error loading ${activeTab}:`, response.status, errorText);
        toast.error(`Ошибка загрузки данных: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error loading ${activeTab}:`, error);
      toast.error("Ошибка загрузки данных");
    }
  };

  const handleDelete = async (id: number, type: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот элемент?")) return;

    const token = getToken();
    let endpoint = "";
    switch (type) {
      case "users":
        endpoint = `${config.endpoints.admin.users}/${id}`;
        break;
      case "events":
        endpoint = `${config.endpoints.admin.events}/${id}`;
        break;
      case "orders":
        endpoint = `${config.endpoints.admin.orders}/${id}`;
        break;
      case "reviews":
        endpoint = `${config.endpoints.admin.reviews}/${id}`;
        break;
      case "messages":
        endpoint = `${config.endpoints.admin.contactMessages}/${id}`;
        break;
    }

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Элемент удален");
        loadData();
        loadStatistics();
      } else {
        toast.error("Ошибка удаления");
      }
    } catch (error) {
      toast.error("Ошибка удаления");
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setDialogMode("edit");
    setFormData(item);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setDialogMode("create");
    setFormData({});
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const token = getToken();
    if (!token) return;

    try {
      let endpoint = "";
      let method = "POST";
      let body = { ...formData };

      switch (activeTab) {
        case "users":
          endpoint = dialogMode === "create"
            ? config.endpoints.admin.users
            : `${config.endpoints.admin.users}/${editingItem.id}`;
          method = dialogMode === "create" ? "POST" : "PUT";
          break;
        case "events":
          endpoint = dialogMode === "create"
            ? config.endpoints.admin.events
            : `${config.endpoints.admin.events}/${editingItem.id}`;
          method = dialogMode === "create" ? "POST" : "PUT";
          break;
        case "orders":
          endpoint = `${config.endpoints.admin.orders}/${editingItem.id}`;
          method = "PUT";
          break;
        case "reviews":
          endpoint = `${config.endpoints.admin.reviews}/${editingItem.id}`;
          method = "PUT";
          break;
        case "messages":
          endpoint = `${config.endpoints.admin.contactMessages}/${editingItem.id}`;
          method = "PUT";
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(dialogMode === "create" ? "Элемент создан" : "Элемент обновлен");
        setIsDialogOpen(false);
        loadData();
        loadStatistics();
      } else {
        const error = await response.json();
        toast.error(error.message || "Ошибка сохранения");
      }
    } catch (error) {
      toast.error("Ошибка сохранения");
    }
  };

  const renderUsersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Имя</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Админ</TableHead>
          <TableHead>Подтвержден</TableHead>
          <TableHead>Дата регистрации</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id || user.Id}>
            <TableCell>{user.id || user.Id}</TableCell>
            <TableCell>{user.name || user.Name}</TableCell>
            <TableCell>{user.email || user.Email}</TableCell>
            <TableCell>
              <Badge variant={(user.isAdmin || user.IsAdmin) ? "default" : "secondary"}>
                {(user.isAdmin || user.IsAdmin) ? "Да" : "Нет"}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={(user.emailVerified || user.EmailVerified) ? "default" : "secondary"}>
                {(user.emailVerified || user.EmailVerified) ? "Да" : "Нет"}
              </Badge>
            </TableCell>
            <TableCell>
              {(user.createdAt || user.CreatedAt) ? new Date(user.createdAt || user.CreatedAt).toLocaleDateString('ru-RU') : '-'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(user.id || user.Id, "users")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderEventsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Место</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead>Избранное</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.id}</TableCell>
            <TableCell className="max-w-xs truncate">{event.title}</TableCell>
            <TableCell>
              {event.date ? new Date(event.date).toLocaleDateString('ru-RU') : '-'}
            </TableCell>
            <TableCell className="max-w-xs truncate">{event.location}</TableCell>
            <TableCell>{event.price}</TableCell>
            <TableCell>
              <Badge variant={event.isFeatured ? "default" : "secondary"}>
                {event.isFeatured ? "Да" : "Нет"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(event.id, "events")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderOrdersTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Номер заказа</TableHead>
          <TableHead>Пользователь</TableHead>
          <TableHead>Сумма</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Дата создания</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id || order.Id}>
            <TableCell>{order.id || order.Id}</TableCell>
            <TableCell>{order.orderNumber || order.OrderNumber}</TableCell>
            <TableCell>{(order.user?.name || order.user?.Name) || (order.user?.email || order.user?.Email)}</TableCell>
            <TableCell>{order.totalAmount || order.TotalAmount} BYN</TableCell>
            <TableCell>
              <Badge variant={
                (order.status || order.Status) === "paid" ? "default" :
                (order.status || order.Status) === "pending" ? "secondary" :
                "destructive"
              }>
                {order.status || order.Status}
              </Badge>
            </TableCell>
            <TableCell>
              {(order.createdAt || order.CreatedAt) ? new Date(order.createdAt || order.CreatedAt).toLocaleDateString('ru-RU') : '-'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(order)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(order.id || order.Id, "orders")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderPaymentsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Сумма</TableHead>
          <TableHead>Способ оплаты</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Пользователь</TableHead>
          <TableHead>Дата</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id || payment.Id}>
            <TableCell>{payment.id || payment.Id}</TableCell>
            <TableCell>{payment.amount || payment.Amount} BYN</TableCell>
            <TableCell>{payment.paymentMethod || payment.PaymentMethod}</TableCell>
            <TableCell>
              <Badge variant={
                (payment.status || payment.Status) === "completed" ? "default" :
                (payment.status || payment.Status) === "pending" ? "secondary" :
                "destructive"
              }>
                {payment.status || payment.Status}
              </Badge>
            </TableCell>
            <TableCell>{payment.user?.email || payment.user?.Email}</TableCell>
            <TableCell>
              {(payment.createdAt || payment.CreatedAt) ? new Date(payment.createdAt || payment.CreatedAt).toLocaleDateString('ru-RU') : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderReviewsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Оценка</TableHead>
          <TableHead>Комментарий</TableHead>
          <TableHead>Пользователь</TableHead>
          <TableHead>Событие</TableHead>
          <TableHead>Одобрен</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id || review.Id}>
            <TableCell>{review.id || review.Id}</TableCell>
            <TableCell>{review.rating || review.Rating}/5</TableCell>
            <TableCell className="max-w-xs truncate">{(review.comment || review.Comment) || "-"}</TableCell>
            <TableCell>{(review.user?.name || review.user?.Name)}</TableCell>
            <TableCell className="max-w-xs truncate">{(review.event?.title || review.event?.Title)}</TableCell>
            <TableCell>
              <Badge variant={(review.isApproved || review.IsApproved) ? "default" : "secondary"}>
                {(review.isApproved || review.IsApproved) ? "Да" : "Нет"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(review)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(review.id || review.Id, "reviews")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderMessagesTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Имя</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Сообщение</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead>Дата</TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contactMessages.map((message) => (
          <TableRow key={message.id || message.Id}>
            <TableCell>{message.id || message.Id}</TableCell>
            <TableCell>{message.name || message.Name}</TableCell>
            <TableCell>{message.email || message.Email}</TableCell>
            <TableCell className="max-w-xs truncate">{message.message || message.Message}</TableCell>
            <TableCell>
              <Badge variant={
                (message.status || message.Status) === "resolved" ? "default" :
                (message.status || message.Status) === "new" ? "secondary" :
                "outline"
              }>
                {message.status || message.Status}
              </Badge>
            </TableCell>
            <TableCell>
              {(message.createdAt || message.CreatedAt) ? new Date(message.createdAt || message.CreatedAt).toLocaleDateString('ru-RU') : '-'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(message)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(message.id || message.Id, "messages")}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderDialog = () => {
    if (activeTab === "users") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Создать пользователя" : "Редактировать пользователя"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Имя</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {dialogMode === "create" && (
              <div>
                <label className="text-sm font-medium">Пароль</label>
                <Input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isAdmin || false}
                onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
              />
              <label className="text-sm font-medium">Администратор</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.emailVerified || false}
                onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
              />
              <label className="text-sm font-medium">Email подтвержден</label>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "events") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Создать событие" : "Редактировать событие"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label className="text-sm font-medium">Название</label>
              <Input
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Изображение (URL)</label>
              <Input
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Дата</label>
              <Input
                type="datetime-local"
                value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Время</label>
              <Input
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Место</label>
              <Input
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Адрес</label>
              <Input
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Цена</label>
              <Input
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Категория</label>
              <Input
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Описание</label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
              />
              <label className="text-sm font-medium">Избранное</label>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "orders") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Редактировать заказ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Статус</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.status || ""}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Ожидает оплаты</option>
                <option value="paid">Оплачен</option>
                <option value="cancelled">Отменен</option>
                <option value="refunded">Возвращен</option>
              </select>
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "reviews") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Редактировать отзыв</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isApproved || false}
                onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
              />
              <label className="text-sm font-medium">Одобрен</label>
            </div>
            <div>
              <label className="text-sm font-medium">Комментарий</label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.comment || ""}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </>
      );
    }

    if (activeTab === "messages") {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Редактировать сообщение</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Статус</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.status || ""}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="new">Новое</option>
                <option value="in_progress">В работе</option>
                <option value="resolved">Решено</option>
                <option value="archived">Архивировано</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Ответ</label>
              <textarea
                className="w-full p-2 border rounded"
                value={formData.response || ""}
                onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  // Простая проверка - если есть токен, показываем страницу
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
          <p className="text-muted-foreground">Управление данными системы</p>
        </div>

        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Пользователи</CardDescription>
                <CardTitle className="text-2xl">{statistics.totalUsers}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>События</CardDescription>
                <CardTitle className="text-2xl">{statistics.totalEvents}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Заказы</CardDescription>
                <CardTitle className="text-2xl">{statistics.totalOrders}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Доход</CardDescription>
                <CardTitle className="text-2xl">{(statistics?.totalRevenue || 0).toFixed(2)} BYN</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="users">Пользователи</TabsTrigger>
              <TabsTrigger value="events">События</TabsTrigger>
              <TabsTrigger value="orders">Заказы</TabsTrigger>
              <TabsTrigger value="payments">Платежи</TabsTrigger>
              <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              <TabsTrigger value="messages">Сообщения</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {(activeTab === "users" || activeTab === "events") && (
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="users">
            <Card>
              <CardContent className="p-6">
                {users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Нет данных</p>
                ) : (
                  renderUsersTable()
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardContent className="p-6">
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Нет данных</p>
                ) : (
                  renderEventsTable()
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardContent className="p-6">
                {orders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Нет данных</p>
                ) : (
                  renderOrdersTable()
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardContent className="p-6">
                {payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Нет данных</p>
                ) : (
                  renderPaymentsTable()
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Нет данных</p>
                ) : (
                  renderReviewsTable()
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardContent className="p-6">
                {contactMessages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Нет данных</p>
                ) : (
                  renderMessagesTable()
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            {renderDialog()}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleSave}>
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Admin;

