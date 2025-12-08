import React, { useEffect, useState, useMemo } from "react";

const iconPaths = {
  eyeClose: "/icons/eyeClose.svg",
  eyeOpen: "/icons/eyeOpen.svg",
  bell: "/icons/bell.svg",
  bellNotification: "/icons/bellNotification.svg",
  calendar: "/icons/calendar.svg",
  dashboard: "/icons/dashboardIcon.svg",
  download: "/icons/download.svg",
  issues: "/icons/issuesIcon.svg",
  imgUpload: "/icons/img-upload.svg",
  imgUpload2: "/icons/img-upload-2.svg",
  inspections: "/icons/inspections.svg",
  facilityIcon: "/icons/facilityIcon.svg",
  locationIcon: "/icons/locationIcon.svg",
  usersIcon: "/icons/usersIcon.svg",
  upload: "/icons/upload.svg",
};

// Caching fetched icons to avoid redundant requests
const iconCache = new Map();

const CustomIcons = ({ name, size = 16 }) => {
  const [svgContent, setSvgContent] = useState(null);

  const iconPath = useMemo(() => iconPaths[name], [name]);

  useEffect(() => {
    if (!iconPath) {
      console.warn(`Icon "${name}" not found.`);
      return;
    }

    if (iconCache.has(name)) {
      setSvgContent(iconCache.get(name));
      return;
    }

    fetch(iconPath)
      .then((response) => response.text())
      .then((data) => {
        const updatedSvg = data
          .replace(/fill="#4E5D6C"/g, 'fill="currentColor"') // Make primary color dynamic
          .replace(/fill="[^"]+"/g, (match) => {
            return match === 'fill="#E4E3E4"' || match === 'fill="#F9C4D2"'
              ? match
              : 'fill="currentColor"';
          });

        iconCache.set(name, updatedSvg); // Cache the result
        setSvgContent(updatedSvg);
      })
      .catch((error) => {
        console.error(`Error loading SVG for ${name}:`, error);
      });
  }, [iconPath, name]);

  if (!svgContent) return null;

  return (
    <span
      style={{ display: "inline-block", width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default CustomIcons;
