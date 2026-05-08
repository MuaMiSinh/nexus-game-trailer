import { useState } from 'react';
import { Copy, Radio } from 'lucide-react';
import { toast } from 'sonner';
import { SmartVideoPlayer } from '@/components/media/SmartVideoPlayer';

export default function CreatorLive() {
  const [title, setTitle] = useState('My Awesome Stream');
  const [previewUrl, setPreviewUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk');
  const [streamKey] = useState(() => 'sk_live_' + Math.random().toString(36).slice(2, 14));
  const rtmpUrl = 'rtmp://your-server.com/live';

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${label}`);
  };

  return (
    <div className="pt-24 pb-20 container max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Radio className="text-neon-pink animate-pulse"/>
        <h1 className="font-display text-3xl text-glow-pink">STREAMER DASHBOARD</h1>
      </div>

      <div className="card-cyber p-6 space-y-5">
        <div>
          <label className="font-heading uppercase tracking-wider text-xs text-foreground/70 mb-1.5 block">Tiêu đề Stream</label>
          <input value={title} onChange={e=>setTitle(e.target.value)} className="input-cyber"/>
        </div>

        <div>
          <label className="font-heading uppercase tracking-wider text-xs text-foreground/70 mb-1.5 block">RTMP Server URL</label>
          <div className="flex gap-2">
            <input readOnly value={rtmpUrl} className="input-cyber flex-1"/>
            <button onClick={() => copy(rtmpUrl, 'RTMP URL')} className="btn-ghost-cyber !py-2 !px-3"><Copy size={16}/></button>
          </div>
        </div>

        <div>
          <label className="font-heading uppercase tracking-wider text-xs text-foreground/70 mb-1.5 block">Stream Key (giữ bí mật)</label>
          <div className="flex gap-2">
            <input readOnly value={streamKey} type="password" className="input-cyber flex-1"/>
            <button onClick={() => copy(streamKey, 'Stream Key')} className="btn-ghost-cyber !py-2 !px-3"><Copy size={16}/></button>
          </div>
        </div>

        <div>
          <label className="font-heading uppercase tracking-wider text-xs text-foreground/70 mb-1.5 block">
            Preview Playback URL (YouTube / Twitch / .m3u8 / .mp4)
          </label>
          <input
            value={previewUrl}
            onChange={e => setPreviewUrl(e.target.value)}
            className="input-cyber"
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="rounded-lg overflow-hidden border border-neon-cyan/30 aspect-video">
          <SmartVideoPlayer
            url={previewUrl}
            title={title}
            className="w-full h-full"
            isLive
            autoPlay
          />
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="font-heading uppercase tracking-wider text-sm text-neon-cyan mb-3">Hướng dẫn OBS Studio</h3>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
            <li>Mở OBS → Settings → Stream</li>
            <li>Service: <span className="text-foreground">Custom...</span></li>
            <li>Server: paste RTMP URL ở trên</li>
            <li>Stream Key: paste Stream Key ở trên</li>
            <li>Apply → Start Streaming</li>
          </ol>
        </div>

        <button className="btn-cyber w-full">Bắt Đầu Stream</button>
      </div>
    </div>
  );
}
