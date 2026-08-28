# Campaign Generator

The campaign generator turns one structured product and one creator persona into multiple UGC concepts.

## Default concepts

1. Problem → Solution
2. Personal Testimonial
3. Fast Product Demo
4. Unboxing + First Impression
5. Before / After

Each concept produces a timed three-part scene plan:

- Hook
- Product Moment
- Payoff

The output is passed to the existing prompt engine. Generation providers are intentionally not coupled to this layer.

## Example input

```js
{
  product: { name: 'Black Cotton T-Shirt', category: 'Fashion' },
  persona: { id: 'male-01' },
  goal: 'Increase conversions',
  durationSeconds: 15,
  aspectRatio: '9:16'
}
```

## Example output

A campaign contains several concepts, and each concept contains its own scene timeline and Seedance-compatible prompt. This makes it possible for the future UI to let a user preview concepts, select one, edit it, and then send it to a video-generation provider.
