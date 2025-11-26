import { XCircle, CheckCircle } from 'lucide-react';

interface HolidayCalendarProps {
    isOpen: boolean;
}

// Static list of major Indian Postal Holidays (Demo for 2024-25)
const POSTAL_HOLIDAYS = [
    { date: '2024-01-26', name: 'Republic Day' },
    { date: '2024-03-25', name: 'Holi' },
    { date: '2024-04-11', name: 'Id-ul-Fitr' },
    { date: '2024-08-15', name: 'Independence Day' },
    { date: '2024-10-02', name: 'Gandhi Jayanti' },
    { date: '2024-10-31', name: 'Diwali' },
    { date: '2024-12-25', name: 'Christmas' },
    // Add more as needed
];

export function HolidayCalendar({ isOpen }: HolidayCalendarProps) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentDay = now.getDay(); // 0 = Sun, 6 = Sat
    
    const holiday = POSTAL_HOLIDAYS.find(h => h.date === todayStr);
    const isSunday = currentDay === 0;
    
    // Status Logic
    let statusText = "OPEN NOW";
    let subText = "Closes at 17:00";
    let statusColor = "text-green-600";
    let BgColor = "bg-green-100";
    
    if (holiday) {
        statusText = "CLOSED TODAY";
        subText = `Holiday: ${holiday.name}`;
        statusColor = "text-red-600";
        BgColor = "bg-red-100";
    } else if (isSunday) {
        statusText = "CLOSED TODAY";
        subText = "Sunday Holiday";
        statusColor = "text-red-600";
        BgColor = "bg-red-100";
    } else if (!isOpen) {
        statusText = "CLOSED NOW";
        subText = "Opens at 09:00";
        statusColor = "text-orange-600";
        BgColor = "bg-orange-100";
    }

    return (
        <div className={`mt-4 p-3 rounded-sm border border-black/10 ${BgColor} flex items-start gap-3`}>
            <div className={`mt-0.5 ${statusColor}`}>
                {statusText.includes("CLOSED") ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            </div>
            <div>
                <div className={`font-bold font-display text-lg leading-none ${statusColor}`}>
                    {statusText}
                </div>
                <div className="text-xs font-mono opacity-80 mt-1 flex items-center gap-2">
                    {subText}
                </div>
                <div className="text-[10px] text-muted-foreground mt-2 font-mono border-t border-black/10 pt-1">
                    Standard Hours: 09:00 - 17:00 (Mon-Sat)
                </div>
            </div>
        </div>
    );
}

// Helper to check open status
export const checkIsOpen = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const todayStr = now.toISOString().split('T')[0];
    
    // Check Holiday
    if (POSTAL_HOLIDAYS.some(h => h.date === todayStr)) return false;
    
    // Check Sunday
    if (day === 0) return false;
    
    // Check Time (9 AM to 5 PM)
    if (hour >= 9 && hour < 17) return true;
    
    return false;
};
