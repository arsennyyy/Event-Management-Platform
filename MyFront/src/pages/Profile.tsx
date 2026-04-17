import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, LogOut, Ticket, Eye, EyeOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MyTickets from "@/components/MyTickets";
import { config } from '@/config';
import { cn } from "@/lib/utils";

const Profile = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Состояния для паролей
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  
  // Состояния для видимости паролей (глазики)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Ошибки и успех
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Вы успешно вышли из системы");
  };

  if (!user) {
    navigate("/signin");
    return null;
  }

  return (
    <Layout>
      {/* Добавили pt-32 md:pt-40 чтобы контент точно начинался ниже хедера */}
      <div className="container px-6 pt-32 md:pt-40 pb-32 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10 items-start">
          
          {/* --- SIDEBAR --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#161616] rounded-2xl border border-white/5 p-6 shadow-2xl sticky top-32"
          >
            <div className="flex flex-col items-center pb-6 border-b border-white/5 mb-6">
              <Avatar className="h-24 w-24 mb-4 ring-2 ring-white/10 ring-offset-4 ring-offset-[#161616]">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-white/10 text-white font-display text-2xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-display font-bold text-white text-center mb-1">{user.name}</h2>
              <p className="text-xs text-white/40 text-center uppercase tracking-wider">
                Участник с {new Date(user.joinedDate).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            <nav className="space-y-2">
              {[
                { icon: <User className="h-4 w-4 mr-3" />, label: "Мой профиль", value: "profile" },
                { icon: <Ticket className="h-4 w-4 mr-3" />, label: "Мои билеты", value: "tickets" },
                { icon: <Settings className="h-4 w-4 mr-3" />, label: "Настройки", value: "settings" },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    activeTab === item.value 
                      ? "bg-white/10 text-white" 
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              
              <div className="h-px bg-white/5 my-4"></div>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Выйти
              </button>
            </nav>
          </motion.div>

          {/* --- MAIN CONTENT --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              
              <TabsList className="bg-[#161616] border border-white/5 p-1.5 rounded-xl mb-8 flex-wrap h-auto inline-flex">
                <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 px-6 py-2.5">Профиль</TabsTrigger>
                <TabsTrigger value="tickets" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 px-6 py-2.5">Мои билеты</TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/50 px-6 py-2.5">Настройки</TabsTrigger>
              </TabsList>

              {/* Вкладка: Профиль */}
              <TabsContent value="profile" className="mt-0 outline-none">
                <div className="bg-[#161616] rounded-2xl border border-white/5 p-6 md:p-10 shadow-2xl">
                  <div className="mb-8 border-b border-white/5 pb-8">
                    <h3 className="text-2xl font-display font-bold text-white mb-2">Личная информация</h3>
                    <p className="text-white/40 text-sm">Обновите вашу личную информацию здесь</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-white/60 text-xs uppercase tracking-wider">Полное имя</Label>
                      <input
                        id="name"
                        defaultValue={user.name}
                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-white/60 text-xs uppercase tracking-wider">Email (нельзя изменить)</Label>
                      <input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3.5 text-white/50 cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-end">
                    <button className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-white/90 transition-colors">
                      Сохранить изменения
                    </button>
                  </div>
                </div>
              </TabsContent>

              {/* Вкладка: Мои билеты */}
              <TabsContent value="tickets" className="mt-0 outline-none">
                <MyTickets />
              </TabsContent>

              {/* Вкладка: Настройки (Смена пароля с глазиками) */}
              <TabsContent value="settings" className="mt-0 outline-none">
                <div className="bg-[#161616] rounded-2xl border border-white/5 p-6 md:p-10 shadow-2xl">
                  <div className="mb-8 border-b border-white/5 pb-8">
                    <h3 className="text-2xl font-display font-bold text-white mb-2">Смена пароля</h3>
                    <p className="text-white/40 text-sm">Убедитесь, что используете надежный пароль</p>
                  </div>

                  <div className="space-y-5 max-w-md">
                    
                    {/* Старый пароль */}
                    <div className="space-y-3">
                      <Label htmlFor="old-password" className="text-white/60 text-xs uppercase tracking-wider">Старый пароль</Label>
                      <div className="relative">
                        <input
                          id="old-password"
                          type={showOldPassword ? "text" : "password"}
                          value={oldPassword}
                          onChange={e => setOldPassword(e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white focus:outline-none focus:border-white/30 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                        >
                          {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Новый пароль */}
                    <div className="space-y-3">
                      <Label htmlFor="new-password" className="text-white/60 text-xs uppercase tracking-wider">Новый пароль</Label>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white focus:outline-none focus:border-white/30 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                        >
                          {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Повторите пароль */}
                    <div className="space-y-3">
                      <Label htmlFor="repeat-password" className="text-white/60 text-xs uppercase tracking-wider">Повторите пароль</Label>
                      <div className="relative">
                        <input
                          id="repeat-password"
                          type={showRepeatPassword ? "text" : "password"}
                          value={repeatPassword}
                          onChange={e => setRepeatPassword(e.target.value)}
                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white focus:outline-none focus:border-white/30 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus:outline-none"
                        >
                          {showRepeatPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                  </div>

                  {passwordError && (
                    <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="mt-6 bg-[#00e59b]/10 border border-[#00e59b]/20 text-[#00e59b] p-4 rounded-xl text-sm">
                      {passwordSuccess}
                    </div>
                  )}

                  <div className="mt-8 flex justify-start">
                    <button
                      className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-white/90 transition-colors"
                      onClick={async () => {
                        setPasswordError(""); setPasswordSuccess("");
                        if (!oldPassword || !newPassword || !repeatPassword) {
                          setPasswordError("Заполните все поля"); return;
                        }
                        if (newPassword !== repeatPassword) {
                          setPasswordError("Пароли не совпадают"); return;
                        }
                        try {
                          const token = localStorage.getItem('token');
                          const res = await fetch(`${config.apiUrl}/api/Auth/change-password`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ OldPassword: oldPassword, NewPassword: newPassword })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setPasswordSuccess("Пароль успешно изменён");
                            setOldPassword(""); setNewPassword(""); setRepeatPassword("");
                          } else {
                            setPasswordError(data.message || "Ошибка смены пароля");
                          }
                        } catch (e) {
                          setPasswordError("Ошибка соединения с сервером");
                        }
                      }}
                    >
                      Сменить пароль
                    </button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;