import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '/Users/rjkigner/projects/pest-map/src/pages/index.module.css';


const HomePage = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const crops = ["wheat", "corn", "soybean"];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        if (lowerCaseSearchTerm === 'wheat') {
          router.push('/crop/wheat');
        } else if (lowerCaseSearchTerm === 'corn') {
          router.push('/crop/corn');
        } else if (lowerCaseSearchTerm === 'soybean') {
          router.push('/crop/soybean');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [searchTerm, router]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}> <div className={styles.sublogo}>powered by</div>Phritzda</div>\
        <div className={styles.links}>
          {/* <button 
            className={activeTab === 'Home' ? styles.activeTab : styles.tabButton} 
            onClick={() => { setActiveTab('Home'); router.push('/'); }}
          >
            Home
          </button> */}
          <button 
            className={activeTab === 'Update Harvest' ? styles.activeTab : styles.tabButton} 
            onClick={() => { setActiveTab('Update Harvest'); router.push('/addMapDate'); }}
          >
            Update Harvest
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Crop Map</h1>
        <input
          type="text"
          placeholder="Search Wheat, Soybean, or Corn"
          value={searchTerm}
          onChange={handleChange}
          className={styles.searchInput}
        />
        {searchTerm && (
          <select className={styles.select}>
            {crops.filter(crop => crop.startsWith(searchTerm.toLowerCase())).map((crop, index) => (
              <option key={index} value={crop}>{crop}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default HomePage;
