
export const getPropertyTypeColor = (type: string) => {
  switch (type) {
    case "Multifamily":
      return "bg-blue-100 text-blue-800";
    case "Industrial":
      return "bg-purple-100 text-purple-800";
    case "Office":
      return "bg-amber-100 text-amber-800";
    case "Retail":
      return "bg-emerald-100 text-emerald-800";
    case "Medical Office":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityStyles = (priority?: string) => {
  switch (priority) {
    case "High":
      return "w-2 h-2 bg-red-500 rounded-full";
    case "Medium":
      return "w-2 h-2 bg-amber-500 rounded-full";
    case "Low":
      return "w-2 h-2 bg-green-500 rounded-full";
    default:
      return "w-2 h-2 bg-gray-300 rounded-full";
  }
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
};
