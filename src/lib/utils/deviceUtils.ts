export const getDeviceId = (): string => {
  const deviceIdKey = "app_device_id";
  let deviceId = localStorage.getItem(deviceIdKey);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(deviceIdKey, deviceId);
  }

  return deviceId;
};

export const getDeviceName = (): string => {
  const ua = navigator.userAgent;
  let os = "Unknown OS";
  let browser = "Unknown Browser";

  if (ua.indexOf("Win") !== -1) os = "Windows";
  else if (ua.indexOf("Mac") !== -1) os = "MacOS";
  else if (ua.indexOf("Linux") !== -1) os = "Linux";
  else if (ua.indexOf("Android") !== -1) os = "Android";
  else if (ua.indexOf("like Mac") !== -1) os = "iOS";

  if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
  else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
  else if (ua.indexOf("Safari") !== -1) browser = "Safari";
  else if (ua.indexOf("Edg") !== -1) browser = "Edge";

  return `${browser} on ${os}`;
};
