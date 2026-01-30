'use client';

import Link from 'next/link';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <ol className={styles.list}>
                <li className={styles.item}>
                    <Link href="/" className={styles.link}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className={styles.item}>
                        <span className={styles.separator}>/</span>
                        {item.href && index < items.length - 1 ? (
                            <Link href={item.href} className={styles.link}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={styles.current}>{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
