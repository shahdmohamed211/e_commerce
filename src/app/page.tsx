import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Welcome to ShopMart</h1>
            <p className={styles.heroDescription}>
              Discover the latest technology, fashion, and lifestyle products. Quality guaranteed with
              fast shipping and excellent customer service.
            </p>
            <div className={styles.heroActions}>
              <Link href="/products" className={styles.btnPrimary}>Shop Now</Link>
              <Link href="/categories" className={styles.btnOutline}>Browse Categories</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
