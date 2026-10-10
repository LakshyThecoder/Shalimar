<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>Shalimar Milano — Sitemap</title>
        <style>
          :root { color-scheme: dark; }
          body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: #0a0908; color: #f2ede6; line-height: 1.5; }
          header { padding: 2rem 1.5rem 1rem; border-bottom: 1px solid #2a2620; }
          h1 { margin: 0; font-size: 1.75rem; letter-spacing: 0.04em; text-transform: uppercase; }
          p { margin: 0.5rem 0 0; color: #9a9085; max-width: 40rem; }
          main { padding: 1.5rem; }
          table { width: 100%; border-collapse: collapse; font-size: 0.95rem; }
          th, td { text-align: left; padding: 0.85rem 0.75rem; border-bottom: 1px solid #2a2620; vertical-align: top; }
          th { color: #e8a317; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; }
          a { color: #f2ede6; text-decoration: none; }
          a:hover { color: #e8a317; }
          .tag { display: inline-block; margin: 0.15rem 0.25rem 0 0; padding: 0.15rem 0.45rem; border: 1px solid #2a2620; color: #9a9085; font-size: 0.75rem; }
          .prio { color: #e8a317; font-weight: 600; }
        </style>
      </head>
      <body>
        <header>
          <h1>Shalimar Milano Sitemap</h1>
          <p>Machine-readable for Google, Bing and AI crawlers. Styled for humans — the XML source is what search engines use.</p>
        </header>
        <main>
          <xsl:choose>
            <xsl:when test="s:sitemapindex">
              <table>
                <thead>
                  <tr>
                    <th>Sitemap</th>
                    <th>Last modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="s:sitemapindex/s:sitemap">
                    <tr>
                      <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                      <td><xsl:value-of select="s:lastmod"/></td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:when>
            <xsl:otherwise>
              <table>
                <thead>
                  <tr>
                    <th>URL</th>
                    <th>Lastmod</th>
                    <th>Change</th>
                    <th>Priority</th>
                    <th>Images / langs</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="s:urlset/s:url">
                    <tr>
                      <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                      <td><xsl:value-of select="s:lastmod"/></td>
                      <td><xsl:value-of select="s:changefreq"/></td>
                      <td class="prio"><xsl:value-of select="s:priority"/></td>
                      <td>
                        <xsl:for-each select="xhtml:link">
                          <span class="tag"><xsl:value-of select="@hreflang"/></span>
                        </xsl:for-each>
                        <xsl:for-each select="image:image">
                          <div class="tag">img: <xsl:value-of select="image:title"/></div>
                        </xsl:for-each>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </xsl:otherwise>
          </xsl:choose>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
