/**
 * Icon registry.
 *
 * Data files name their icon as a string, but `import * as Icons from
 * 'lucide-react'` would pull the entire ~1000-icon set into the bundle — it
 * measured 527 kB. Only the icons actually referenced are imported here, and
 * looked up by name through `getIcon`.
 *
 * Adding an icon to a data file means adding it to this map too. That is the
 * deliberate cost of not shipping the whole library.
 */
import {
  Armchair, Bluetooth, Box, Cable, Check, CircuitBoard, Cpu, Fan, Gamepad2,
  Grid2x2, HardDrive, MemoryStick, Mic, Monitor, MonitorPlay, Mouse, Package,
  ShieldCheck, Speaker, Target, Usb, Video, Webcam, Wifi, Wrench, Zap,
} from 'lucide-react';

const REGISTRY = {
  Armchair, Bluetooth, Box, Cable, Check, CircuitBoard, Cpu, Fan, Gamepad2,
  Grid2x2, HardDrive, MemoryStick, Mic, Monitor, MonitorPlay, Mouse, Package,
  ShieldCheck, Speaker, Target, Usb, Video, Webcam, Wifi, Wrench, Zap,
};

/** Resolve a registry name, falling back to a neutral mark. */
export function getIcon(name) {
  return REGISTRY[name] ?? Check;
}
