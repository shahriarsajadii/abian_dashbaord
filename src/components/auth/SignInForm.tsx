import { useState } from "react";
import {Link, useNavigate} from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useAuth } from '../../hooks/useAuth.js';

export default function SignInForm() {

  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [credentials, setCredentials] = useState({ phone_number: '', password: '' });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('خطا در ورود، اطلاعات اشتباه است.');
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (user) {
    navigate('/');
    return null; // در صورت لاگین بودن کاربر، صفحه لاگین نمایش داده نمی‌شود
  }



  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              ابیان - ورود
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              برای ورود به داشبورد شماره تلفن و رمز عبور خود را وارد کنید !
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    شماره تلفن :
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="09121234567"
                         value={credentials.phone_number}
                         onChange={(e)=>setCredentials({...credentials,phone_number:e.target.value})} />
                </div>
                <div>
                  <Label>
                    رمز عبور <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                        value={credentials.password}
                        onChange={(e)=>setCredentials({...credentials, password:e.target.value})}
                      type={showPassword ? "text" : "password"}
                      placeholder="رمز عبور خود را وارد کنید"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer left-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                     مرا به خاطر بسپار
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    رمز عبور خود را فراموش کرده اید؟
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                   ورود
                  </Button>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
