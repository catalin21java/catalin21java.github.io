# Tools4IT Company Website

A modern, responsive website for an IT company featuring a fixed navbar, hero section with image and call-to-action button, and various sections showcasing services, portfolio, and more.

## Features

- Fixed navigation bar that stays at the top of the page
- Hero section with image, text, and call-to-action button
- Services section with icon cards
- About section with company information and statistics
- Portfolio section with project showcase
- Contact section with form and company information
- Footer with quick links, services, and newsletter subscription
- Login functionality with credential verification
- Dashboard page for authenticated users
- Fully responsive design for all device sizes
- Smooth scrolling and animations

## Login Credentials

To access the dashboard, use the following credentials:
- Username: admin
- Password: password123

## Stock Images

The website uses the following stock images from Unsplash:

1. Hero Image: [IT Team Working](https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80)
2. About Image: [Team Collaboration](https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80)
3. Portfolio Images:
   - E-commerce Platform: [E-commerce](https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80)
   - Banking Mobile App: [Mobile Banking](https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80)
   - Healthcare Dashboard: [Healthcare Analytics](https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80)
   - Cloud Migration: [Cloud Computing](https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80)
   - Security Assessment: [Cybersecurity](https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80)
   - IT Infrastructure: [IT Consulting](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300&q=80)

## Setup Instructions

1. Clone or download this repository to your local machine.
2. Open the `index.html` file in your web browser to view the website.
3. Click on the "Login" button in the navbar to access the login page.
4. Use the credentials provided above to log in and access the dashboard.

## Project Structure

- `index.html` - Main website page
- `login.html` - Login page
- `dashboard.html` - Dashboard page (accessible after login)
- `css/`
  - `styles.css` - Main stylesheet
  - `login.css` - Login page styles
  - `dashboard.css` - Dashboard page styles
- `js/`
  - `script.js` - JavaScript functionality
- `images/` - Directory for image files

## Customization

### Colors

The website uses a color scheme defined in CSS variables. You can easily change the colors by modifying the following variables in the `css/styles.css` file:

```css
:root {
    --primary-color: #4e73df;
    --secondary-color: #1cc88a;
    --dark-color: #2e384d;
    --light-color: #f8f9fc;
    --danger-color: #e74a3b;
    --gray-color: #858796;
}
```

### Content

To update the content of the website, edit the `index.html` file. The file is structured with clear section comments to help you locate specific areas to modify.

### Adding New Sections

To add a new section to the website:

1. Create a new section element in the `index.html` file with an appropriate ID.
2. Add the section to the navigation menu in the navbar.
3. Style the section in the `css/styles.css` file.
4. If needed, add any JavaScript functionality in the `js/script.js` file.

## Browser Compatibility

This website is compatible with all modern browsers, including:

- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge
- Opera

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox for layout)
- JavaScript (ES6+)
- Font Awesome for icons

## License

This project is available for personal and commercial use.

## Credits

- Font Awesome for the icons
- Unsplash for stock images
- Google Fonts for typography

---

Created by Tools4IT © 2025 