/**
 * Centralna definicija svih URL putanja.
 * Mjenjati SAMO ovdje — sve komponente čitaju odavde.
 */

export const routes = {
  home:        '/',
  products:    '/proizvodi',
  blog:        '/blog',
  about:       '/o-nama',
  contact:     '/kontakt',
  privacy:     '/privatnost',
  terms:       '/uslovi',
  sitemap:     '/mapa-sajta',

  product:   (slug) => `/proizvodi/${slug}`,
  category:  (slug) => `/kategorije/${slug}`,
  post:      (slug) => `/blog/${slug}`,
  brand:     (slug) => `/brendovi/${slug}`,
}
