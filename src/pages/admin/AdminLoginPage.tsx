import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signInWithUsername } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) =&gt; {
    e.preventDefault();
    if (!username || !password) { toast.error('请输入用户名和密码'); return; }
    setLoading(true);
    const { error } = await signInWithUsername(username, password);
    setLoading(false);
    if (error) {
      toast.error('用户名或密码错误');
    } else {
      navigate('/admin');
    }
  };

  return (
    <div>
      &lt;Card className="w-full max-w-[calc(100%-2rem)] md:max-w-md"&gt;
        &lt;CardHeader className="text-center space-y-3 pb-4"&gt;
          <div>H</div>
          <div>
            <h1>Haosi Power</h1>
            <p>{t('admin.title')}</p>
          </div>
        &lt;/CardHeader&gt;
        &lt;CardContent&gt;
          &lt;form onSubmit={handleSubmit} className="space-y-4"&gt;
            <div>
              &lt;Label htmlFor="username"&gt;用户名 / 邮箱&lt;/Label&gt;
              <div>
                &lt;Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /&gt;
                &lt;Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e =&gt; setUsername(e.target.value)}
                  placeholder="admin 或 admin@miaoda.com"
                  className="pl-9"
                  required
                /&gt;
              </div>
            </div>
            <div>
              &lt;Label htmlFor="password"&gt;Password&lt;/Label&gt;
              <div>
                &lt;Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /&gt;
                &lt;Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e =&gt; setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  required
                /&gt;
                &lt;button type="button" onClick={() =&gt; setShowPwd(v =&gt; !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"&gt;
                  {showPwd ? &lt;EyeOff className="h-4 w-4" /&gt; : &lt;Eye className="h-4 w-4" /&gt;}
                &lt;/button&gt;
              </div>
            </div>
            &lt;Button type="submit" className="w-full" disabled={loading}&gt;
              {loading ? 'Signing in...' : t('nav.login')}
            &lt;/Button&gt;
          &lt;/form&gt;
        &lt;/CardContent&gt;
      &lt;/Card&gt;
    </div>
  );
}