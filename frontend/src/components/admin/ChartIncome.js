import Chart from "../../components/admin/Chart";
import { useEffect, useMemo, useState } from "react";
import axios from 'axios';

export default function ChartIncome() {
    const [userStats, setUserStats] = useState([]); // Doanh thu theo tháng
    const [dailyStats, setDailyStats] = useState([]); // Doanh thu theo ngày

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

    useEffect(() => {
        const getStats = async () => {
            try {
                // Lấy doanh thu theo tháng
                const monthlyRes = await axios.get('/api/v1/admin/orders/income');
                const monthlyStats = MONTHS.map((month, index) => {
                    const monthData = monthlyRes.data.find(item => item._id === index + 1);
                    return {
                        name: month,
                        "Doanh thu": monthData ? monthData.total : 0,
                    };
                });
                setUserStats(monthlyStats);

                // Lấy doanh thu theo ngày
                const dailyRes = await axios.get('/api/v1/admin/orders/daily-income');
                const dailyStats = dailyRes.data.map((dayData) => {
                    return {
                        name: `Ngày ${dayData._id}`, // Dùng _id là ngày trong năm
                        "Doanh thu": dayData.total,
                    };
                });
                setDailyStats(dailyStats);

            } catch (error) {
                console.error(error);
            }
        };

        getStats();
    }, [MONTHS]);

    return (
        <div>
            {/* Biểu đồ doanh thu hàng tháng */}
            <Chart
                data={userStats}
                title="Doanh thu hàng tháng"
                grid
                dataKey="Doanh thu"
            />
            {/* Biểu đồ doanh thu theo ngày */}
            <Chart
                data={dailyStats}
                title="Doanh thu theo ngày"
                grid
                dataKey="Doanh thu"
            />
        </div>
    );
}