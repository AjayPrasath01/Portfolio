# 🚀 Ajay Prasath - 3D Portfolio Website

A stunning, interactive portfolio website featuring modern 3D designs using Three.js, showcasing professional experience, skills, and projects with immersive visual effects.

## 🌟 Features

### 🎨 Visual Design
- **Dark Theme with Glassmorphism**: Modern dark interface with frosted glass effects
- **Gradient Accents**: Vibrant cyan and purple color scheme
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Typography**: Clean Inter font family for excellent readability

### 🎯 3D Animations & Effects
- **Hero Section**: Interactive particle system with floating geometric shapes
- **About Section**: Animated DNA helix visualization representing data and connections
- **Projects Section**: Network visualization showing interconnected nodes
- **Mouse Interactions**: Camera movement responds to mouse position
- **Smooth Animations**: GSAP-powered transitions and scroll effects

### 📱 Interactive Elements
- **Loading Screen**: 3D rotating cube animation
- **Smooth Scrolling**: Seamless navigation between sections
- **Mobile Navigation**: Hamburger menu for mobile devices
- **Scroll Animations**: Elements animate into view as you scroll
- **3D Tilt Cards**: Project cards with perspective tilt on hover
- **Skill Tag Animations**: Interactive hover effects on skill badges

### 🔧 Technical Features
- **Performance Optimized**: Debounced scroll handlers and efficient animations
- **Cross-browser Compatible**: Works across modern browsers
- **SEO Friendly**: Proper meta tags and semantic HTML structure
- **Accessibility**: Keyboard navigation and screen reader friendly

## 🛠️ Technologies Used

- **Three.js** - 3D graphics and animations
- **HTML5** - Semantic markup structure
- **CSS3** - Advanced styling with custom properties
- **JavaScript (ES6+)** - Interactive functionality
- **GSAP** - Animation library for smooth transitions
- **WebGL** - Hardware-accelerated graphics rendering

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Installation

1. **Clone or Download** the repository:
   ```bash
   git clone <repository-url>
   # or download and extract the ZIP file
   ```

2. **Open the portfolio**:
   - **Simple method**: Double-click `index.html` to open in your browser
   - **Local server method** (recommended for development):
     ```bash
     # Using Python (if installed)
     python -m http.server 8000
     
     # Using Node.js (if installed)
     npx http-server
     
     # Using PHP (if installed)
     php -S localhost:8000
     ```

3. **Navigate** to `http://localhost:8000` if using a local server

### File Structure
```
portfolio/
├── index.html          # Main HTML structure
├── styles.css          # CSS styles and animations
├── script.js           # JavaScript functionality and 3D scenes
├── README.md           # This file
└── assets/             # (Optional) For additional images/files
```

## 🎨 Customization Guide

### 🎯 Personal Information
Edit the following sections in `index.html`:

```html
<!-- Update hero section -->
<h1 class="hero-title">
    <span class="title-line">YOUR</span>
    <span class="title-line">NAME</span>
</h1>
<p class="hero-subtitle">Your Title</p>
<p class="hero-description">"Your personal tagline or quote"</p>

<!-- Update contact information -->
<a href="mailto:your-email@domain.com">your-email@domain.com</a>
<a href="tel:+1234567890">+1 234 567 890</a>
```

### 🎨 Color Scheme
Modify CSS variables in `styles.css`:

```css
:root {
    --primary-color: #00f5ff;      /* Main accent color */
    --secondary-color: #ff006e;    /* Secondary accent */
    --accent-color: #8338ec;       /* Third accent color */
    --bg-dark: #0a0a0a;           /* Background */
    --text-primary: #ffffff;       /* Main text */
    --text-secondary: #b3b3b3;     /* Secondary text */
}
```

### 🚀 3D Scene Customization
Modify particle counts and colors in `script.js`:

```javascript
// Particle system
const particleCount = 1000; // Increase for more particles

// Geometry colors
const cubeMaterial = new THREE.MeshBasicMaterial({
    color: 0x8338ec, // Change cube color
    wireframe: true
});
```

### 📝 Content Updates
Update your information in the respective sections:

1. **About Section**: Edit the about text and skills
2. **Experience Section**: Add/modify timeline items
3. **Projects Section**: Update project cards with your projects
4. **Contact Section**: Update contact details and social links

## 🔧 Performance Optimization

### 🚀 Tips for Better Performance
1. **Reduce Particle Count**: Lower the `particleCount` for slower devices
2. **Optimize Images**: Use compressed images in WebP format
3. **Lazy Loading**: Implement lazy loading for images
4. **Code Splitting**: Split JavaScript into smaller modules for larger projects

### 📱 Mobile Optimization
- The portfolio is fully responsive and optimized for mobile devices
- 3D effects are automatically scaled based on device capabilities
- Touch interactions are supported for mobile navigation

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 60+     | ✅ Full Support |
| Firefox | 55+     | ✅ Full Support |
| Safari  | 12+     | ✅ Full Support |
| Edge    | 79+     | ✅ Full Support |

## 🚀 Deployment

### GitHub Pages
1. Push your code to a GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your portfolio will be available at `https://username.github.io/repository-name`

### Netlify
1. Drag and drop your project folder to [Netlify](https://netlify.com)
2. Your site will be automatically deployed

### Vercel
1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Deploy with one click

## 🤝 Contributing

Feel free to fork this project and customize it for your own use. If you make improvements, consider sharing them!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Features Breakdown

### Hero Section
- **3D Particle System**: 1000+ animated particles creating a dynamic background
- **Floating Geometries**: Wireframe cube, torus, and sphere with rotation animations
- **Mouse Interaction**: Camera follows mouse movement for immersive experience
- **Typing Animation**: Hero title appears with typewriter effect

### About Section
- **DNA Helix Visualization**: Represents data connections and biological precision
- **Skill Tags**: Interactive tags with hover animations
- **Glassmorphism Cards**: Modern frosted glass effect for content containers

### Experience Timeline
- **Animated Timeline**: Scroll-triggered animations reveal experience items
- **Hover Effects**: Cards lift and glow on interaction
- **Responsive Layout**: Adapts to mobile with vertical timeline

### Projects Showcase
- **Network Visualization**: 3D nodes and connections representing project relationships
- **Card Tilt Effect**: 3D perspective transforms on mouse movement
- **Technology Tags**: Color-coded technology stack indicators

### Contact Section
- **Interactive Contact Cards**: Hover animations and transitions
- **Social Links**: Direct links to professional profiles
- **Education & Certifications**: Organized display of qualifications

## 🔮 Future Enhancements

- [ ] Add project detail modals
- [ ] Implement blog integration
- [ ] Add testimonials section
- [ ] Include downloadable resume
- [ ] Add theme switcher (light/dark mode)
- [ ] Integrate with CMS for easy content updates

## 📞 Support

If you have any questions or need help customizing the portfolio, feel free to reach out!

---

**Built with ❤️ using Three.js and modern web technologies** 