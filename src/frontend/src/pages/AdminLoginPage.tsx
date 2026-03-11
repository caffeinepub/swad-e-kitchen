import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

export default function AdminLoginPage() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const success = login(password);
      if (success) {
        navigate({ to: "/admin/panel" });
      } else {
        setError("Galat password! Dobara try karein.");
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            Swad-E-Kitchen
          </h1>
          <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-center text-gray-800">
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Admin password dalein"
                    className="pr-10 border-gray-200 focus:border-primary focus:ring-primary"
                    data-ocid="admin.login_input"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  data-ocid="admin.error_state"
                  className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
                >
                  ⚠️ {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11"
                disabled={isLoading}
                data-ocid="admin.submit_button"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="text-xs text-center text-gray-400 mt-4">
              Sirf authorized admin hi access kar sakte hain
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
