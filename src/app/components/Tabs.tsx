"use client";

export default function Tabs({ 
  activeTab, 
  setActiveTab 
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const tabs = [
    { name: 'Students', icon: '👨‍🎓' },
    { name: 'Attendance', icon: '📅' },
    { name: 'Reports', icon: '📊' }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav className="flex -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === tab.name
                ? 'border-primary text-primary dark:border-primary-dark dark:text-primary-light'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}