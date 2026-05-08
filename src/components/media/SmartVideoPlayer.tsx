import { useMemo } from 'react';

interface SmartVideoPlayerProps {
  url: string;
  title: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  isLive?: boolean;
}

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be']);

function normalizeHost(value: string) {
  return value.replace(/^www\./, '').toLowerCase();
}

function getYoutubeId(input: URL): string | null {
  const host = normalizeHost(input.hostname);
  if (host === 'youtu.be') {
    return input.pathname.slice(1) || null;
  }
  if (!YOUTUBE_HOSTS.has(input.hostname.toLowerCase())) {
    return null;
  }
  if (input.pathname.startsWith('/embed/')) {
    return input.pathname.replace('/embed/', '').split('/')[0] || null;
  }
  return input.searchParams.get('v');
}

function getTwitchChannel(input: URL): string | null {
  const host = normalizeHost(input.hostname);
  if (host === 'player.twitch.tv') {
    return input.searchParams.get('channel');
  }
  if (host !== 'twitch.tv') {
    return null;
  }
  const segment = input.pathname.split('/').filter(Boolean)[0];
  return segment || null;
}

function isDirectVideo(pathname: string) {
  return /\.(mp4|webm|ogg)$/i.test(pathname);
}

function isHls(pathname: string) {
  return /\.m3u8$/i.test(pathname);
}

export function SmartVideoPlayer({
  url,
  title,
  className,
  autoPlay = false,
  muted = false,
  isLive = false,
}: SmartVideoPlayerProps) {
  const parsed = useMemo(() => {
    try {
      return new URL(url);
    } catch {
      return null;
    }
  }, [url]);

  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';

  const config = useMemo(() => {
    if (!parsed) {
      return { mode: 'invalid' as const };
    }

    const youtubeId = getYoutubeId(parsed);
    if (youtubeId) {
      const embed = new URL(`https://www.youtube.com/embed/${youtubeId}`);
      if (autoPlay) embed.searchParams.set('autoplay', '1');
      if (muted) embed.searchParams.set('mute', '1');
      embed.searchParams.set('rel', '0');
      embed.searchParams.set('modestbranding', '1');
      return { mode: 'iframe' as const, src: embed.toString() };
    }

    const twitchChannel = getTwitchChannel(parsed);
    if (twitchChannel) {
      const embed = new URL('https://player.twitch.tv/');
      embed.searchParams.set('channel', twitchChannel);
      embed.searchParams.set('parent', hostname);
      embed.searchParams.set('autoplay', autoPlay ? 'true' : 'false');
      embed.searchParams.set('muted', muted ? 'true' : 'false');
      return { mode: 'iframe' as const, src: embed.toString() };
    }

    if (isDirectVideo(parsed.pathname) || isHls(parsed.pathname)) {
      return { mode: 'video' as const, src: parsed.toString() };
    }

    return { mode: 'iframe' as const, src: parsed.toString() };
  }, [parsed, hostname, autoPlay, muted]);

  if (config.mode === 'invalid') {
    return (
      <div className={`w-full h-full bg-muted/40 flex items-center justify-center text-sm text-muted-foreground ${className ?? ''}`}>
        Nguon video khong hop le.
      </div>
    );
  }

  if (config.mode === 'video') {
    return (
      <video
        className={className}
        src={config.src}
        controls
        autoPlay={autoPlay}
        muted={muted}
        playsInline
      />
    );
  }

  return (
    <iframe
      title={title}
      src={config.src}
      className={className}
      allow={isLive ? 'autoplay; fullscreen; picture-in-picture' : 'autoplay; encrypted-media; fullscreen; picture-in-picture'}
      allowFullScreen
    />
  );
}
