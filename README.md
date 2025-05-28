# Ajay Prasath - 3D Portfolio Website

A stunning, modern portfolio website featuring interactive 3D elements built with Three.js and responsive design.

## Features

### 🌟 3D Interactive Elements
- **Background Particles**: Floating animated particles with custom shaders
- **Hero Section**: Interactive geometric shapes with mouse movement response
- **About Section**: DNA-like helix structure animation
- **Contact Section**: Network nodes with pulsing animations

### 🎨 Modern Design
- Glassmorphism UI elements
- Gradient text and backgrounds
- Smooth animations and transitions
- Mobile-responsive design
- Custom loading screen

### 📱 Responsive Layout
- Optimized for desktop, tablet, and mobile
- Performance optimizations for mobile devices
- Touch-friendly navigation

### ⚡ Performance Features
- Optimized Three.js rendering
- Efficient particle systems
- Mobile performance adaptations
- Smooth scrolling and animations

## Getting Started

### Prerequisites
- A modern web browser that supports WebGL
- Python 3.x (for local development server)

### Running the Portfolio

1. **Clone or download the files**
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Start a local server**
   Since you mentioned port 8000 is in use, try a different port:
   ```bash
   # Try port 3000
   python3 -m http.server 3000
   
   # Or port 8080
   python3 -m http.server 8080
   
   # Or any other available port
   python3 -m http.server 5000
   ```

3. **Open in browser**
   Navigate to `http://localhost:[PORT]` where [PORT] is the port you chose

### Alternative Methods
- Use VS Code Live Server extension
- Use Node.js serve: `npx serve .`
- Use any other static file server

## File Structure

```
Portfolio/
├── index.html          # Main HTML file
├── styles.css          # Comprehensive CSS styling
├── script.js           # Three.js animations and interactions
└── README.md          # This file
```

## Technical Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, animations
- **JavaScript ES6+**: Interactive functionality
- **Three.js**: 3D graphics and animations
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

## 3D Scenes Breakdown

### Background Scene
- Animated particle system with custom shaders
- Floating movement with sine/cosine animations
- Color-coded particles (primary and accent colors)

### Hero Scene
- Central rotating cube with transparency
- Wireframe outer cube
- Floating spheres in orbital pattern
- Mouse interaction for rotation control

### About Scene
- DNA-style double helix structure
- Animated rotation
- Connected line segments
- Color-coded points

### Contact Scene
- Network topology visualization
- Pulsing node animations
- Dynamic connections between nearby nodes
- Spherical distribution pattern

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance Notes

- The portfolio automatically reduces particle count on mobile devices
- WebGL performance depends on device capabilities
- Some older devices may experience reduced frame rates

## Customization

### Colors
Primary colors are defined in CSS custom properties in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --accent-color: #06d6a0;
}
```

### 3D Elements
Modify the Three.js scenes in `script.js` to change:
- Particle count and behavior
- Geometric shapes and materials
- Animation speeds and patterns
- Colors and lighting

## Contact Information

- **Email**: prasathajay01@gmail.com
- **Phone**: +91 8220730199
- **Portfolio**: https://ajay.today
- **LinkedIn**: https://www.linkedin.com/in/ajay-prasath-r-b56779210

## License

This portfolio is created for personal use. Feel free to use it as inspiration for your own projects.

---

Built with ❤️ by Ajay Prasath 