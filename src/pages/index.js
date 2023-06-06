import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './index.module.css'; 

const HomePage = () => {
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
      <div className={styles.content}>
        <h1 className={styles.title}>Pest Map</h1>
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
        <div className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/addMapDate">Update Harvest</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
