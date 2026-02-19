import type { SDK, Player } from 'ysdk';

let _ysdk: SDK | null = null;
let _player: Player | null = null;

export async function initYSDK(): Promise<SDK | null> {
  if (_ysdk) return _ysdk;
  try {
    if (typeof YaGames === 'undefined') return null;
    _ysdk = await YaGames.init();
    return _ysdk;
  } catch (e) {
    console.error('Failed to init Yandex SDK:', e);
    return null;
  }
}

export async function initPlayer(ysdk: SDK): Promise<Player | null> {
  if (_player) return _player;
  try {
    _player = await ysdk.getPlayer();
    return _player;
  } catch (e) {
    console.error('Failed to init Yandex player:', e);
    return null;
  }
}

export function getSDK(): SDK | null {
  return _ysdk;
}

export function getPlayerInstance(): Player | null {
  return _player;
}
