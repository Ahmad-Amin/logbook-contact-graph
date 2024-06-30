// src/components/LogBookChart.js

import React, { useEffect, useState, useCallback } from "react";
import ApexCharts from "react-apexcharts";
import { db, collection, query, where, getCountFromServer } from "../firebase";
import Loader from "./Loader";

const startingDateOfThisYear = "2024-01-02T00:00:00";

const ContactsGraphWithSeverRequests = () => {
  const [weekData, setWeekData] = useState({});
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(false);
  const [monthLabel, setMonthLabel] = useState("");

  const getDailyCount = async (startOfDay, endOfDay) => {
    const q = query(
      collection(db, "LogBookContact"),
      where("timestamp", ">=", startOfDay),
      where("timestamp", "<=", endOfDay)
    );
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count || 0;
  };

  const getWeeklyData = useCallback(async (weekStart) => {
    try {
      setLoading(true);
      const weeklyData = {};
      const monthSet = new Set();

      for (let i = 0; i < 7; i++) {
        const dayStart = new Date(weekStart);
        dayStart.setDate(weekStart.getDate() + i);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const count = await getDailyCount(dayStart, dayEnd);
        const dayString = dayStart.toISOString().split("T")[0];
        weeklyData[dayString] = count;

        const month = dayStart.toLocaleString("default", { month: "long" });
        monthSet.add(month);
      }

      setMonthLabel([...monthSet].join(" - "));

      setLoading(false);
      return weeklyData;
    } catch (e) {
      console.error("Error fetching weekly data:", e);
      setLoading(false);
      return {};
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const startOfYear = new Date(startingDateOfThisYear);
      const weekStart = new Date(startOfYear);
      weekStart.setDate(startOfYear.getDate() + (currentWeek - 1) * 7);

      const data = await getWeeklyData(weekStart);
      setWeekData(data);
    };

    fetchData();
  }, [getWeeklyData, currentWeek]);

  const generateChartData = (data, labels) => ({
    series: [
      {
        name: `Week ${currentWeek} Data`,
        data,
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 500,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        width: 2,
      },
      markers: {
        size: 4,
        hover: {
          size: 5,
        },
      },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            colors: "#FFFFFF",
          },
        },
      },
      yaxis: {
        min: 0,
        labels: {
          style: {
            colors: "#FFFFFF",
          },
        },
      },
      tooltip: {
        theme: "dark",
      },
      title: {
        style: {
          color: "#FFFFFF",
        },
      },
      legend: {
        labels: {
          colors: "#FFFFFF",
        },
      },
      grid: {
        borderColor: "#90A4AE",
        strokeDashArray: 0,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        row: {
          colors: undefined,
          opacity: 0.5,
        },
        column: {
          colors: undefined,
          opacity: 0.5,
        },
      },
    },
  });

  const getChartData = () => {
    const labels = [];
    const data = [];

    const startOfYear = new Date(startingDateOfThisYear);
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfYear);
      day.setDate(startOfYear.getDate() + (currentWeek - 1) * 7 + i);
      const dayString = day.toISOString().split("T")[0];
      labels.push(dayString);
      data.push(weekData[dayString] || 0);
    }

    return generateChartData(data, labels);
  };

  const handleNextWeek = () => setCurrentWeek((prevWeek) => prevWeek + 1);

  const handlePrevWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek((prevWeek) => prevWeek - 1);
    }
  };

  return (
    <div className="p-10 bg-[#000030] text-white w-full h-screen">
      <div className="bg-[#0A0B39] p-10">
        <div>
          <h2 className="text-3xl font-semibold text-start my-3">
            LogBook Contact Data
          </h2>
          <hr className="mb-4" />
          <div className="flex flex-row justify-end mr-10">
            <h3 className="text-white font-semibold text-lg">
              {monthLabel} 2024
            </h3>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={handlePrevWeek} disabled={currentWeek === 1}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 stroke-[#17F9DA]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </span>
            </button>
            <p className="text-lg font-semibold text-[#17F9DA]">
              Week {currentWeek}
            </p>
            <button onClick={handleNextWeek}>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  className="w-5 stroke-[#17F9DA]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </span>
            </button>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="h-[400px] mx-auto mt-2">
              <ApexCharts
                options={getChartData().options}
                series={getChartData().series}
                type="line"
                height={400}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactsGraphWithSeverRequests;
