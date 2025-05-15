import React, { memo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { themeClasses } from '../utils/themeUtils';

interface UserAvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  name?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-20 w-20'
};

function UserAvatarComponent({
  src,
  alt,
  size = 'sm',
  showName = false,
  name,
  className = ''
}: UserAvatarProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      {showName && name && (
        <span className={`ml-2 text-xs font-medium ${themeClasses.text(theme)}`}>
          {name}
        </span>
      )}
    </div>
  );
}

const UserAvatar = memo(UserAvatarComponent);
UserAvatar.displayName = 'UserAvatar';

export default UserAvatar;
