import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { Auth, db } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [userRole, setUserRole] = useState("");
  const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });
  const [signupData, setSignupData] = useState({ labels: [], datasets: [] });
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSignups, setTotalSignups] = useState(0);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(Auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : "user";
        setUserRole(role);
      }
    });

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const unsubRevenue = onSnapshot(collection(db, "revenue"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());

      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const sorted = [...data].sort(
        (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
      );

      const labels = sorted.map((item) => item.month);
      const values = sorted.map((item) => item.total);

      setRevenueData({
        labels,
        datasets: [
          {
            label: "Revenue (₹)",
            data: values,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      });

      setTotalRevenue(values.reduce((acc, val) => acc + val, 0));
    });

    return () => unsubRevenue();
  }, []);

  useEffect(() => {
    const unsubSignups = onSnapshot(
      collection(db, "signupData"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());

        const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const sorted = [...data].sort(
          (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
        );

        const labels = sorted.map((item) => item.day);
        const values = sorted.map((item) => item.total);

        setSignupData({
          labels,
          datasets: [
            {
              label: "New Signups",
              data: values,
              backgroundColor: "#10b981",
            },
          ],
        });

        setTotalSignups(values.reduce((acc, val) => acc + val, 0));
      }
    );

    return () => unsubSignups();
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-800 p-4 rounded-lg text-white">
          <h3 className="text-sm text-zinc-400">Total Revenue</h3>
          <p className="text-xl font-semibold">
            ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-zinc-800 p-4 rounded-lg text-white">
          <h3 className="text-sm text-zinc-400">Total Signups</h3>
          <p className="text-xl font-semibold">{totalSignups}</p>
        </div>
        {userRole === "admin" && (
          <div className="bg-green-900 p-4 rounded-lg text-green-300">
            <h3 className="text-sm text-green-200">Role</h3>
            <p className="text-xl font-semibold">Admin</p>
          </div>
        )}
      </div>

      <div className="bg-[#121826] p-6 rounded-xl border border-zinc-700 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Revenue Trends</h2>
        </div>

        {revenueData.labels.length > 0 ? (
          <Line data={revenueData} />
        ) : (
          <p className="text-zinc-400">Loading revenue data...</p>
        )}
      </div>

      <div className="bg-[#121826] p-6 rounded-xl border border-zinc-700 shadow-md">
        <h2 className="text-white text-xl font-semibold mb-4">
          Weekly Signups
        </h2>
        {signupData.labels.length > 0 ? (
          <Bar data={signupData} />
        ) : (
          <p className="text-zinc-400">Loading signup data...</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
