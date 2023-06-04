import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function HarvestPage() {
  const [data, setData] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('');
  const [selectedPercent, setSelectedPercent] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/harvest')
      .then((res) => res.json())
      .then(setData);
  }, []);

  const handleCountyChange = (e) => {
    setSelectedCounty(e.target.value);
    const countyData = data.find((item) => item.name === e.target.value);
    setSelectedPercent(countyData ? countyData.harvest_percent : '');
  };

  const handlePercentChange = (e) => {
    setSelectedPercent(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSave = () => {
    const updatedData = data.map((item) =>
      item.name === selectedCounty && parseInt(selectedYear) > parseInt(item.year) ? 
      { ...item, harvest_percent: selectedPercent, year: selectedYear } : item
    );


 
    fetch('/api/harvest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then(() => setData(updatedData))
      .then(() => router.push('/')); // This line will redirect to the homepage
  };

  return (
    <div>
      <select value={selectedCounty} onChange={handleCountyChange}>
        {data.map((item) => (
          <option key={item.id} value={item.name}>
            {item.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        step="0.1"
        value={selectedPercent}
        onChange={handlePercentChange}
      />
       <input
        type="number"
        value={selectedYear}
        onChange={handleYearChange}
      />

      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default HarvestPage;
