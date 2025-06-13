import React, { useEffect, useState, useRef } from 'react';

// Banner cache system to avoid multiple API calls
class BannerCache {
    private static instance: BannerCache;
    private advertiseBanners: AdvertiseBanner[] = [];
    private isLoading = false;
    private loadPromise: Promise<AdvertiseBanner[]> | null = null;
    private promotionBanner: PromotionBanner | null = null;

    static getInstance(): BannerCache {
        if (!BannerCache.instance) {
            BannerCache.instance = new BannerCache();
        }
        return BannerCache.instance;
    }

    async getAdvertiseBanners(): Promise<AdvertiseBanner[]> {
        // Return cached data if available
        if (this.advertiseBanners.length > 0) {
            return this.advertiseBanners;
        }

        // Return existing promise if already loading
        if (this.isLoading && this.loadPromise) {
            return this.loadPromise;
        }

        // Start loading
        this.isLoading = true;
        this.loadPromise = this.fetchAdvertiseBanners();
        
        try {
            this.advertiseBanners = await this.loadPromise;
            return this.advertiseBanners;
        } finally {
            this.isLoading = false;
        }
    }

    private async fetchAdvertiseBanners(): Promise<AdvertiseBanner[]> {
        try {
            const response = await fetch('https://bonusforyou.org/api/advertiseBanner');
            const data = await response.json();
            
            if (data.status && data.data.length > 0) {
                return data.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching advertisement banners:', error);
            return [];
        }
    }

    getRandomBanner(): AdvertiseBanner | null {
        if (this.advertiseBanners.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.advertiseBanners.length);
        return this.advertiseBanners[randomIndex];
    }

    async getPromotionBanner(): Promise<PromotionBanner | null> {
        if (this.promotionBanner) {
            return this.promotionBanner;
        }

        try {
            const response = await fetch("https://bonusforyou.org/api/PromotionBannerlist");
            const data = await response.json();
            if (data.status && data.data) {
                this.promotionBanner = data.data;
                return this.promotionBanner;
            }
            return null;
        } catch (error) {
            console.error("Error fetching promotion banner:", error);
            return null;
        }
    }

    // Clear cache (useful for refresh scenarios)
    clearCache(): void {
        this.advertiseBanners = [];
        this.promotionBanner = null;
        this.isLoading = false;
        this.loadPromise = null;
    }
}

// Get cache instance
const bannerCache = BannerCache.getInstance();

type PromotionBanner = {
    draw_image: string;
    draw_name: string;
};

interface BannerImage {
    id: number;
    advertiser_id: number;
    display_app_name: string;
    display_page_id: number;
    display_position: string;
    display_banner_image: string;
    display_banner_target_link: string;
    display_credit: number;
    display_countrt: string;
    display_status: number;
    created_at: string;
    updated_at: string;
}

interface AdvertiseBanner {
    id: number;
    image: string;
    link: string;
    status: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

interface BannerComponentProps {
    pageName: string; // e.g., "Available Events", "Ongoing Events", etc.
    position: 'top' | 'bottom';
    className?: string;
}

// Track impressions per session to avoid duplicate calls
const sessionImpressions = new Set<string>();

const BannerComponent: React.FC<BannerComponentProps> = ({ 
    pageName, 
    position, 
    className = "rounded-lg shadow-lg w-[90vw] h-[120px] mx-auto my-2"
}) => {
    const [bannerImage, setBannerImage] = useState<BannerImage | null>(null);
    const [fallbackBanner, setFallbackBanner] = useState<AdvertiseBanner | null>(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const impressionSent = useRef(false);
    const [promotionBanner, setPromotionBanner] = useState<PromotionBanner | null>(null);
    
    // Page name to page_id mapping based on actual API data
    const getPageId = (pageName: string): number => {
        const pageMapping: { [key: string]: number } = {
            'Participant My panel': 19,
            'Available Events': 22,
            'Ongoing Events': 24,
            'Participated Events': 26,
            'Prize I Won': 28,
            'Participants My Profile': 30,
            'Available Events Details': 40,
            'Ongoing Events Details': 41,
            'Participated Events Details': 42,
            'Prize I Won Details': 43,
            'Global Random': 44
        };
        return pageMapping[pageName] || 4; 
    };

    // Track banner impression (only once per banner per session)
    const trackImpression = async (pageId: number, bannerId: number) => {
        const impressionKey = `${pageId}-${bannerId}`;
        
        if (sessionImpressions.has(impressionKey) || impressionSent.current) {
            return;
        }

        try {
            await fetch('https://bonusforyou.org/api/user/page-wise-banner-impression', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page_id: pageId,
                    banner_id: bannerId
                })
            });
            
            sessionImpressions.add(impressionKey);
            impressionSent.current = true;
        } catch (error) {
            console.error('Error tracking banner impression:', error);
        }
    };

    // Track banner click
    const trackClick = async (pageId: number, bannerId: number) => {
        try {
            await fetch('https://bonusforyou.org/api/user/page-wise-banner-click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page_id: pageId,
                    banner_id: bannerId
                })
            });
        } catch (error) {
            console.error('Error tracking banner click:', error);
        }
    };

    // Fetch fallback advertisement banner
    const fetchFallbackBanner = async () => {
        try {
            // First try to get an advertisement banner
            const banners = await bannerCache.getAdvertiseBanners();
            if (banners.length > 0) {
                const randomIndex = Math.floor(Math.random() * banners.length);
                setFallbackBanner(banners[randomIndex]);
                return;
            }
            
            // If no advertisement banner, fall back to promotional banner
            const promotion = await bannerCache.getPromotionBanner();
            if (promotion) {
                setPromotionBanner(promotion);
            }
        } catch (error) {
            console.error('Error fetching fallback banner:', error);
        }
    };

    useEffect(() => {
        const fetchBannerData = async () => {
            try {
                console.log(`BannerComponent mounting: ${pageName} - ${position}`); // Debug log
                setLoading(true);
                const pageId = getPageId(pageName);
                console.log(`BannerComponent pageId: ${pageId} for ${pageName} - ${position}`); // Debug log

                // Use different API endpoints for development vs production
                const isDevelopment = import.meta.env.DEV;
                const apiUrl = isDevelopment 
                    ? `/api/banner/get-banner-image?app_name=rewardsmonster&page_id=${pageId}&position=${position}`
                    : `https://bonusforyou.org/api/user/get-banner-image?app_name=rewardsmonster&page_id=${pageId}&position=${position}`;
                
                console.log(`BannerComponent API URL: ${apiUrl}`); // Debug log

                // Fetch banner directly using the correct API
                const response = await fetch(apiUrl);
                console.log(`BannerComponent API response status: ${response.status} for ${pageName} - ${position}`); // Debug log

                if (response.ok) {
                    const data = await response.json();
                    console.log(`BannerComponent API data:`, data); // Debug log
                    
                    if (data.status && data.data && data.data.length > 0) {
                        const banner = data.data[0];
                        
                        if (banner.display_status === 1) {
                            setBannerImage(banner);
                            // Track impression when banner is loaded
                            setTimeout(() => {
                                trackImpression(pageId, banner.id);
                            }, 1000); // Small delay to ensure banner is visible
                            return;
                        }
                    } else {
                        console.log(`BannerComponent: No banner data for ${pageName} - ${position}`); // Debug log
                    }
                }
                
                // If no banner found or API error, fetch fallback
                console.log(`BannerComponent: Fetching fallback for ${pageName} - ${position}`); // Debug log
                await fetchFallbackBanner();
                
            } catch (error) {
                console.error(`BannerComponent error for ${pageName} - ${position}:`, error);
                // Fetch fallback on error
                await fetchFallbackBanner();
            } finally {
                setLoading(false);
            }
        };

        fetchBannerData();
    }, [pageName, position]);

    const handleBannerClick = async () => {
        if (bannerImage) {
            const pageId = getPageId(pageName);
            
            // Track click
            await trackClick(pageId, bannerImage.id);
            
            // Open link if available
            if (bannerImage.display_banner_target_link) {
                window.open(bannerImage.display_banner_target_link, '_blank', 'noopener,noreferrer');
            }
        } else if (fallbackBanner?.link) {
            // Handle fallback banner click
            window.open(fallbackBanner.link, '_blank', 'noopener,noreferrer');
        }
    };

    const handleImageError = () => {
        setImageError(true);
        // If main banner image fails, try to load fallback
        if (bannerImage && !fallbackBanner && !promotionBanner) {
            fetchFallbackBanner();
        }
    };

    // Don't render anything if loading
    if (loading) {
        return null;
    }

    // Determine which banner to show
    let bannerSrc = '';
    let bannerAlt = '';

    // Choose which banner to show based on availability
    if (bannerImage && !imageError) {
        bannerSrc = `https://bonusforyou.org/public/AdverBannerImages/${bannerImage.display_banner_image}`;
        bannerAlt = `${pageName} ${position} banner`;
    } else if (promotionBanner) {
        bannerSrc = promotionBanner.draw_image;
        bannerAlt = promotionBanner.draw_name || `Promotion banner`;
    } else if (fallbackBanner) {
        bannerSrc = fallbackBanner.image;
        bannerAlt = `Advertisement ${fallbackBanner.id}`;
    }

    // Don't render if no banner available
    if (!bannerSrc) {
        return null;
    }

    return (
        <div className="banner-container">
            <img
                src={bannerSrc}
                alt={bannerAlt}
                className={`cursor-pointer ${className}`}
                onClick={handleBannerClick}
                loading="lazy"
                onError={handleImageError}
                onLoad={() => {
                    console.log('Banner loaded successfully:', bannerSrc);
                }}
            />
        </div>
    );
};

export default BannerComponent;