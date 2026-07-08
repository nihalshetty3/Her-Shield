import { useEffect, useRef } from 'react';

export const useShakeDetector = (onShake, isEnabled) => {
  const lastAcc = useRef([null, null, null]);
  const lastTime = useRef(0);
  const lastTriggerTime = useRef(0);
  const enabledTime = useRef(0);
  const onShakeRef = useRef(onShake);

  useEffect(() => {
    onShakeRef.current = onShake;
  }, [onShake]);

  useEffect(() => {
    if (isEnabled) {
      enabledTime.current = Date.now();
    }
  }, [isEnabled]);

  useEffect(() => {
    if (!onShake || !isEnabled) return;

    if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
      console.warn('[ShakeDetector] DeviceMotionEvent is not supported on this device/browser.');
      return;
    }

    const handleMotion = (event) => {
      if (Date.now() - enabledTime.current < 500) {
        return;
      }

      let x = null;
      let y = null;
      let z = null;

      if (event.acceleration && event.acceleration.x !== null && event.acceleration.x !== undefined) {
        x = event.acceleration.x;
        y = event.acceleration.y;
        z = event.acceleration.z;
      } else if (event.accelerationIncludingGravity && event.accelerationIncludingGravity.x !== null && event.accelerationIncludingGravity.x !== undefined) {
        x = event.accelerationIncludingGravity.x;
        y = event.accelerationIncludingGravity.y;
        z = event.accelerationIncludingGravity.z;
      }

      if (x === null || y === null || z === null) return;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime.current;
      const [lastX, lastY, lastZ] = lastAcc.current;

      if (lastX !== null && lastY !== null && lastZ !== null) {
        const deltaX = Math.abs(x - lastX);
        const deltaY = Math.abs(y - lastY);
        const deltaZ = Math.abs(z - lastZ);
        const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

        if (delta > 1.5 && timeDiff < 150) {
          if (currentTime - lastTriggerTime.current > 1000) {
            lastTriggerTime.current = currentTime;
            if (onShakeRef.current) {
              onShakeRef.current();
            }
          }
        }
      }

      lastAcc.current = [x, y, z];
      lastTime.current = currentTime;
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [onShake, isEnabled]);
};

export default useShakeDetector;
