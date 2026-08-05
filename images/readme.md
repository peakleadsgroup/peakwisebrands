# images/

Each brand gets a subfolder named after its slug (same as `{slug}.html` / `{slug}-redirect.html`).

```
images/
  {brand-slug}/
    favicon.png      (logo — used by lander + redirect)
    hero.png         (lander header image)
    icon-1.png       (lander benefit icons)
    icon-2.png
    icon-3.png
    icon-4.png
```

Templates that use these paths:
- `landertemplate.html` — favicon, hero, 4 icons
- `redirecttemplate.html` — favicon/logo only (Stripe thank-you page)

Do not put brand assets in the root of `images/` — only inside the brand subfolder.
