import React from 'react';
import {Avatar} from "@8base/boost";

export const getAvatar = (picture) => {
  if (!picture) return null;
  const { downloadUrl, filename } = picture;
  return <Avatar src={downloadUrl} size="md" firstName={filename}/>;
}