import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import axios from './axiosConfig';

const COLORS = ['#007bff', '#ffc107', '#28a745']; // Pending, In Progress, Completed

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    fetchOverview();
    fetchTrends();
  }, []);

  const fetchOverview = async () => {
    const res = await axios.get('/analytics/overview');
    setOverview(res.data);
  };

  const fetchTrends = async () => {
    const res = await axios.get('/analytics/trends');
    const formatted = formatTrends(res.data);
    setTrends(formatted);
  };

  const formatTrends = (raw) => {
    const grouped = {};

    raw.forEach((item) => {
      const label = `W${item._id.week} ${item._id.year}`;
      if (!grouped[label]) grouped[label] = { week: label };
      grouped[label][item._id.status] = item.count;
    });

    return Object.values(grouped);
  };

  return (
    <div>
      <h2 className="h5 mb-3">📊 Analytics Dashboard</h2>

      {!overview ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-body">
                  <h5 className="card-title">Total Tasks</h5>
                  <p className="card-text fs-4">{overview.total}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success mb-3">
                <div className="card-body">
                  <h5 className="card-title">Completed</h5>
                  <p className="card-text fs-4">{overview.completed}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-warning mb-3">
                <div className="card-body">
                  <h5 className="card-title">Pending</h5>
                  <p className="card-text fs-4">{overview.pending}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <h5 className="mt-4">Status Breakdown</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Pending', value: overview.pending },
                  { name: 'Completed', value: overview.completed },
                  { name: 'Other', value: overview.total - overview.completed - overview.pending }
                ]}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Bar Chart */}
          <h5 className="mt-5">Weekly Trends</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pending" fill="#007bff" />
              <Bar dataKey="In Progress" fill="#ffc107" />
              <Bar dataKey="Completed" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default Dashboard;

