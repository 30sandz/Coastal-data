import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getBeachConditions } from '../../services/beachService';

const ConditionsChart = ({ beachId }) => {
  const [timeRange, setTimeRange] = useState('24h');
  
  const { data: conditions, isLoading, error } = useQuery(
    ['beachConditions', beachId, timeRange],
    () => getBeachConditions(beachId),
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Error loading conditions data: {error.message}
      </Alert>
    );
  }

  // Format data for the chart
  const formatData = (data) => {
    if (!data) return [];

    return data.map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString(),
      waveHeight: item.waveHeight,
      windSpeed: item.windSpeed,
      waterTemperature: item.waterTemperature,
    }));
  };

  const chartData = formatData(conditions);

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <ToggleButtonGroup
          value={timeRange}
          exclusive
          onChange={(e, newValue) => newValue && setTimeRange(newValue)}
          size="small"
        >
          <ToggleButton value="24h">24h</ToggleButton>
          <ToggleButton value="7d">7 Days</ToggleButton>
          <ToggleButton value="30d">30 Days</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="waveHeight"
            stroke="#8884d8"
            name="Wave Height (m)"
            dot={false}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="windSpeed"
            stroke="#82ca9d"
            name="Wind Speed (km/h)"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="waterTemperature"
            stroke="#ffc658"
            name="Water Temperature (°C)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ConditionsChart; 