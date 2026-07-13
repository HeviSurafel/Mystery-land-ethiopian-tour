// lib/metadata.ts
import { Metadata } from 'next'

interface PageMetadataProps {
  title: string
  description: string
  keywords?: string[]
  image?: string
  canonical?: string
  type?: 'website' | 'article'  // Removed 'product' as it's not valid for OpenGraph
  publishedTime?: string
  authors?: string[]
  tags?: string[]
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  canonical,
  type = 'website',
  publishedTime,
  authors = ['We Travel Ethiopia Tours'],
  tags = [],
}: PageMetadataProps): Metadata {
  const baseUrl = 'https://www.omodeltatours.com'
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`
  const canonicalUrl = canonical || `${baseUrl}${canonical || ''}`

  // Base metadata
  const metadata: Metadata = {
    title: `${title} | We Travel Ethiopia Tours`,
    description,
    keywords: [
      ...keywords,
      'Ethiopia tours',
      'Omo Valley',
      'travel',
      'safari',
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'We Travel Ethiopia Tours',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: type === 'article' ? 'article' : 'website',
      ...(type === 'article' && publishedTime && {
        article: {
          publishedTime,
          authors,
          tags,
        },
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: '@omodeltatours',
      site: '@omodeltatours',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }

  return metadata
}

// For product pages, use a different approach
export function generateProductMetadata({
  title,
  description,
  image = '/product-image.jpg',
  availability = 'instock',
  productId,
  brand = 'We Travel Ethiopia Tours',
}: {
  title: string
  description: string
  image?: string
  availability?: 'instock' | 'outofstock' | 'preorder'
  productId?: string
  brand?: string
}): Metadata {
  const baseUrl = 'https://www.omodeltatours.com'
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`

  return {
    title: `${title} | We Travel Ethiopia Tours`,
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: 'We Travel Ethiopia Tours',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website', // Use 'website' type for products as well
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
    },
    // Add product structured data separately via JSON-LD
  }
}