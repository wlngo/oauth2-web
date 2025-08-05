import { useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { GalleryVerticalEnd } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formRequest } from "@/lib/http"
import { cn } from "@/lib/utils"
import placeholder from "@/assets/placeholder.svg"

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await formRequest('/login', {
        username: username,
        password: password,
      }, {
        csrf: true,
        csrfUseCache: false // 作为请求控制项单独放到 options 里
      })

      if (res.code === 200) {
        const target = res.data.targetUrl;
        if (target) {
          window.location.href = target;
        } else {
          router.navigate({ to: "/" });
        }
      }

      if (res.code != 200) {
        setError(res.msg)
      }


    } catch (err: any) {
      setError(err.message || "登录失败")
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src={placeholder}
          alt="backgroud"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme 公司
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <form
            className={cn("flex flex-col gap-6 w-full max-w-xs")}
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">登录你的账户</h1>
              <p className="text-muted-foreground text-sm text-balance">
                输入你的邮箱和密码进行登录
              </p>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">邮箱</Label>
                <Input
                  id="username"
                  type="username"
                  autoComplete="username"
                  placeholder="your@user.com"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">密码</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    忘记密码？
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="remember-me"
                  className="size-4 accent-primary"
                  defaultChecked
                />
                <Label htmlFor="rememberMe" className="text-sm">
                  记住我
                </Label>
              </div>
              <Button type="submit" className="w-full" onClick={handleSubmit}>
                登录
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-background text-muted-foreground relative z-10 px-2">
                  或使用以下方式登录
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = `${import.meta.env.VITE_API_BASE}/oauth2/authorization/github`;
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                  {/* GitHub SVG Path */}
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 
                  0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
                  0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
                  C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 
                  1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 
                  2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605
                  -2.665-.3-5.466-1.332-5.466-5.93 
                  0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 
                  0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 
                  1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 
                  3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 
                  1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 
                  0 1.606-.015 2.896-.015 3.286 
                  0 .315.21.69.825.57C20.565 22.092 
                  24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
                使用 GitHub 登录
              </Button>

            </div>

            <div className="text-center text-sm">
              还没有账号？{" "}
              <a href="#" className="underline underline-offset-4">
                注册新账户
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
