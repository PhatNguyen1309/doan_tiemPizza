import Chart from "../../components/admin/Chart";
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';

export default function ChartIncome() {
    const [userStats, setUserStats] = useState([]);
    const [dailyStats, setDailyStats] = useState([]);

    const MONTHS = useMemo(
        () => [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
        ],
        []
    );

    const DAYS_IN_MONTH = useMemo(
        () => Array.from({ length: 31 }, (_, i) => `Ngày ${i + 1}`),
        []
    );

    useEffect(() => {
        const getStats = async () => {
            try {
                // Lấy doanh thu theo tháng
                const monthlyRes = await axios.get('/api/v1/admin/orders/income');
                
                const monthlyStats = MONTHS.map((month, index) => {
                    const monthData = monthlyRes.data.find(item => item._id === index + 1);
                    return {
                        name: month,
                        "Danh thu": monthData ? monthData.total : 0,
                    };
                });

                setUserStats(monthlyStats);

                // Lấy doanh thu theo ngày
                const dailyRes = await axios.get('/api/v1/admin/orders/daily-income');
                
                const dailyStats = DAYS_IN_MONTH.map((day, index) => {
                    const dayData = dailyRes.data.find(item => item.date === `2024-12-${index + 1}`); // Giả sử ngày được lưu theo định dạng '2024-12-01'
                    return {
                        name: day,
                        "Danh thu": dayData ? dayData.total : 0,
                    };
                });

                setDailyStats(dailyStats);

            } catch (error) {
                console.error(error);
            }
        };

        getStats();
    }, [MONTHS, DAYS_IN_MONTH]);

    return (
        <div>
            {/* Biểu đồ doanh thu hàng tháng */}
            <Chart
                data={userStats}
                title="Doanh thu hàng tháng"
                grid
                dataKey="Danh thu"
            />
            {/* Biểu đồ doanh thu theo ngày */}
            <Chart
                data={dailyStats}
                title="Doanh thu hàng ngày"
                grid
                dataKey="Danh thu"
            />
        </div>
    );
}
