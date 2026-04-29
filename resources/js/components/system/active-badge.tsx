import React from 'react'

type ActiveBadgeProps = {
    isActive: boolean;
};

function ActiveBadge({ isActive }: ActiveBadgeProps) {
  return (
    <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
    >
        {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

export default ActiveBadge
