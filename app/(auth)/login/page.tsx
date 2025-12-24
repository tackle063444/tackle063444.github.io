import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(99,102,241,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      <div className="mb-8 flex items-center gap-2 text-2xl font-bold text-primary">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-indigo-500/20">
           <Package2 className="h-6 w-6" />
        </div>
        <span className="bg-gradient-to-br from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-slate-100 dark:to-slate-400">
          SP System
        </span>
      </div>

      <Card className="w-full max-w-md border-slate-200/60 shadow-xl shadow-slate-200/50 transition-all backdrop-blur-sm bg-white/80 dark:bg-slate-950/80 dark:shadow-none dark:border-slate-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Enter your email to sign in to your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="admin@sp-system.com" 
              required 
              className="bg-white/50 dark:bg-slate-900/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              required 
              className="bg-white/50 dark:bg-slate-900/50"
            />
          </div>
          <Link href="/dashboard" className="w-full block"> {/* Remove this Link for real auth, just for demo */}
             <Button className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/20 transition-all h-10 text-base">
               Sign in
             </Button>
          </Link>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50 py-4 border-t">
          Managed by IT Department
        </CardFooter>
      </Card>
      
      <div className="mt-8 text-center text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000">
        &copy; 2025 SP Stock System. All rights reserved.
      </div>
    </div>
  )
}
