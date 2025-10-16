# 💰 Student Finance Tracker

**Live Demo**: (https://annie-bw.github.io/student-finance-tracker/)

GitHub Repository link: https://github.com/annie-bw/student-finance-tracker.git
Demo video :

A simple and intuitive web application designed to help students manage their finances, track expenses, and build healthy saving habits.

---

## 🎨 Chosen Theme

**Student Finance Management**

This application is specifically designed for students who need to:
- Track limited budgets (allowances, part-time job income)
- Manage expenses across common student categories (fees, books, food, transport)
- Build savings habits early in life
- Understand where their money goes each month

The theme focuses on simplicity, visual clarity, and mobile-first design since most students access apps on their phones.

---

## ✨ Features List

### Core Features
1. **Transaction Management**
   - Add income and expenses with detailed information
   - Edit existing transactions
   - Delete transactions with confirmation
   - Automatic date defaulting to today

2. **Dashboard Overview**
   - Real-time summary cards (Total Expenses, Savings, Spending, Remaining Balance)
   - Visual spending breakdown by category
   - Progress bars showing category spending proportions
   - Responsive grid layout

3. **Records & Filtering**
   - Comprehensive transaction history table
   - Search by description or category
   - Filter by category (Income, Fees, Books, Food, etc.)
   - Filter by type (Income/Expense)
   - Date range filtering (from/to dates)
   - Sort by date (newest/oldest first)
   - Pagination-ready structure

4. **Data Export/Import**
   - Export all records to CSV format
   - CSV includes: Date, Description, Category, Type, Amount
   - Import functionality via seed data

5. **Settings & Customization**
   - Multi-currency support (RWF, USD, EUR, GBP, KES)
   - Real-time currency conversion
   - Budget cap setting with remaining balance calculation
   - Currency preview showing conversion examples

6. **Savings Tracker**
   - Current total savings display
   - Income vs. Expenses comparison
   - Visual cards with color-coded information
   - Financial health insights

### Technical Features
- **Local Storage Persistence**: All data saved locally
- **Single Page Application**: No page reloads
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Offline-First**: Works without internet connection
- **No Dependencies**: Pure vanilla JavaScript

---

## 🔍 Regex Catalog

### 1. Amount Validation
**Pattern**: `^\d+(\.\d{1,2})?$`

**Purpose**: Validates monetary amounts

**Breakdown**:
- `^` - Start of string
- `\d+` - One or more digits
- `(\.\d{1,2})?` - Optional decimal point followed by 1-2 digits
- `$` - End of string

**Examples**:
- ✅ Valid: `1000`, `1000.5`, `1000.50`, `0.99`, `5000000`
- ❌ Invalid: `1000.123`, `-1000`, `abc`, `10,000`, `1000.`

### 2. Description/Search Input Sanitization
**Pattern**: `/[<>]/g`

**Purpose**: Remove potential HTML injection characters

**Examples**:
- Input: `Lunch <script>alert('xss')</script>` → Output: `Lunch scriptalert('xss')/script`
- Input: `Books > $50` → Output: `Books  $50`

### 3. Currency Symbol Extraction (if needed)
**Pattern**: `/[^\d.-]/g`

**Purpose**: Extract only numeric values from formatted currency strings

**Examples**:
- Input: `$1,234.56` → Output: `1234.56`
- Input: `RWF 50,000` → Output: `50000`

### 4. Date Format Validation
**Pattern**: `^\d{4}-\d{2}-\d{2}$`

**Purpose**: Validates YYYY-MM-DD format

**Examples**:
- ✅ Valid: `2025-10-17`, `2024-01-01`, `2025-12-31`
- ❌ Invalid: `10/17/2025`, `2025-13-01`, `25-10-17`

### 5. Category Name Validation
**Pattern**: `/^[a-zA-Z\s]+$/`

**Purpose**: Ensures category names contain only letters and spaces

**Examples**:
- ✅ Valid: `Food`, `Transport`, `Books and Supplies`
- ❌ Invalid: `Food123`, `Transport!`, `Books@Home`

---

## ⌨️ Keyboard Navigation Map

### Global Navigation
- **Tab**: Navigate through interactive elements (buttons, inputs, links)
- **Shift + Tab**: Navigate backwards
- **Enter**: Activate focused button or submit form
- **Escape**: Close modals or cancel operations (delete confirmation)

### Form Controls
- **Tab**: Move to next input field
- **Shift + Tab**: Move to previous field
- **Arrow Keys**: Navigate dropdown options in select elements
- **Space**: Toggle dropdown menus
- **Enter**: Submit transaction form

### Navigation Bar
- **Tab**: Cycle through navigation buttons (Dashboard, Add Transaction, Records, Savings, Settings, About)
- **Enter/Space**: Activate navigation button to switch sections

### Records Table
- **Tab**: Navigate through action buttons (Edit/Delete)
- **Enter**: Execute edit or delete action on focused button
- **Arrow Keys**: (Future implementation) Navigate table rows

### Filter Controls
- **Tab**: Move between filter inputs
- **Enter**: Apply filters (when focus is on filter button)
- **Ctrl/Cmd + F**: (Browser default) Opens browser find - can search visible records

### Accessibility Shortcuts (Recommended Implementation)
- **Alt + D**: Jump to Dashboard
- **Alt + A**: Jump to Add Transaction
- **Alt + R**: Jump to Records
- **Alt + S**: Jump to Settings

---

## ♿ Accessibility (a11y) Notes

### Current Implementations

1. **Semantic HTML**
   - Proper use of `<header>`, `<nav>`, `<main>`, `<section>` elements
   - `<table>` with `<thead>` and `<tbody>` for records
   - `<label>` elements properly associated with form inputs

2. **Color Contrast**
   - All text meets WCAG AA standards (4.5:1 ratio minimum)
   - Border colors on cards provide visual distinction
   - Action buttons use distinct colors (green for edit, red for delete)

3. **Focus Indicators**
   - All interactive elements have visible focus states
   - Form inputs show blue outline on focus
   - Buttons have hover and active states

4. **Responsive Text Sizing**
   - Base font size: 0.9rem (mobile) to 1rem (desktop)
   - Relative units (rem) used throughout for better scaling
   - Text remains readable at 200% zoom

5. **Form Accessibility**
   - All inputs have associated labels
   - Required fields validated with helpful error messages
   - Form errors announced via `alert()` (screen reader compatible)

### Improvements Needed

1. **ARIA Labels**
   - Add `aria-label` to icon buttons (Edit/Delete)
   - Add `aria-describedby` for form field hints
   - Add `role="alert"` for error messages

2. **Keyboard Navigation**
   - Add keyboard shortcuts for main navigation
   - Implement arrow key navigation in tables
   - Add escape key to close delete confirmation

3. **Screen Reader Enhancements**
   - Add `sr-only` class for screen reader-only text
   - Announce when transactions are added/deleted
   - Add `aria-live` regions for dynamic updates

4. **Skip Links**
   - Add "Skip to main content" link
   - Add "Skip to navigation" link

5. **Error Handling**
   - Replace `alert()` with custom accessible modals
   - Add inline error messages for form validation
   - Visual and programmatic error indication

### Testing Recommendations
- Test with NVDA or JAWS screen reader
- Use browser accessibility dev tools (Lighthouse, axe DevTools)
- Keyboard-only navigation testing
- Test at 200% browser zoom
- Color blindness simulation testing

---

## 🧪 How to Run Tests

### Manual Testing Checklist

#### 1. **Setup and Data Persistence**
```bash
# Open the app in browser
# Open DevTools > Application > Local Storage
# Verify 'transactions' key exists after adding data
```

#### 2. **Transaction Operations**
- [ ] Add income transaction
- [ ] Add expense transaction
- [ ] Edit existing transaction
- [ ] Delete transaction
- [ ] Verify localStorage updates after each operation

#### 3. **Filter & Search Testing**
```javascript
// Test in browser console:
// 1. Add test data with seed.json
// 2. Apply each filter type
// 3. Verify filtered results match criteria

// Search test
// Type "food" in search → should show only food-related transactions

// Category filter test
// Select "Books" → should show only book transactions

// Date range test
// Set from: 2025-01-01, to: 2025-01-31 → should show only January transactions
```

#### 4. **Calculation Tests**
```javascript
// Test in browser console:
function testCalculations() {
  console.log('Total Expenses:', calculateTotalExpenses());
  console.log('Total Savings:', calculateTotalSavings());
  console.log('Expected vs Actual:', {
    expected: 'manual calculation',
    actual: 'function result'
  });
}
```

#### 5. **Currency Conversion Tests**
- [ ] Change currency to USD
- [ ] Verify all amounts update
- [ ] Check currency symbols are correct
- [ ] Test with RWF, EUR, GBP, KES

#### 6. **Export/Import Tests**
- [ ] Export to CSV
- [ ] Open CSV in Excel/Google Sheets
- [ ] Verify all fields are correct
- [ ] Load seed.json data
- [ ] Verify all 10+ records loaded

#### 7. **Responsive Design Tests**
```bash
# Open DevTools > Device Toolbar
# Test on:
# - iPhone SE (375px)
# - iPad (768px)
# - Desktop (1024px+)

# Verify:
# - Navigation is usable
# - Cards stack/grid properly
# - Table scrolls horizontally on mobile
# - No horizontal overflow
```

#### 8. **Edge Cases**
```javascript
// Test these scenarios:
// 1. Empty state (no transactions)
// 2. Very large amounts (999999999)
// 3. Very small amounts (0.01)
// 4. Special characters in descriptions
// 5. Future dates
// 6. Past dates (years ago)
// 7. Maximum localStorage capacity
```

#### 9. **Regex Validation Tests**
```javascript
// Amount validation tests
testAmount('1000');      // ✅ Should pass
testAmount('1000.50');   // ✅ Should pass
testAmount('1000.123');  // ❌ Should fail
testAmount('-100');      // ❌ Should fail
testAmount('abc');       // ❌ Should fail
```

#### 10. **Keyboard Navigation Tests**
- [ ] Tab through all elements
- [ ] Submit form with Enter key
- [ ] Navigate buttons with keyboard only
- [ ] Test filter controls with keyboard
- [ ] Verify focus indicators visible

### Automated Testing (Future Implementation)

```bash
# Install Jest (if implementing unit tests)
npm install --save-dev jest

# Run tests
npm test
```

**Example Test Structure**:
```javascript
// tests/calculations.test.js
describe('Finance Calculations', () => {
  test('calculates total expenses correctly', () => {
    // Test implementation
  });
  
  test('calculates savings correctly', () => {
    // Test implementation
  });
});
```

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd student-finance-tracker
   ```

2. **Open the application**
   ```bash
   # Simply open index.html in your browser
   # OR use a local server:
   python -m http.server 8000
   # OR
   npx serve
   ```

3. **Load seed data**
   - Go to Settings
   - Use browser console: `localStorage.setItem('transactions', JSON.stringify(seedData))`
   - Refresh the page

---

## 🎯 Project Structure

```
student-finance-tracker/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Application logic
├── seed.json          # Sample data (10+ records)
├── README.md          # This file
└── assets/            # (Optional) Images/icons
```

---

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Required Features**:
- LocalStorage API
- ES6+ JavaScript
- CSS Grid & Flexbox
- Intl.NumberFormat API

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1023px (two columns)
- **Desktop**: ≥ 1024px (four columns)

---

## 🔐 Privacy & Security

- All data stored locally in browser
- No external API calls
- No user tracking or analytics
- Data never leaves your device
- Clear browser data to reset application

---

## 📄 License

This project is free to use for educational purposes.

---

## 👨‍💻 Developer

[Your Name]  
[Your Contact/GitHub]

---

## 🤖 Development Tools & AI Assistance

### AI Assistance Disclosure
Portions of this project were developed with assistance from **Claude AI (Anthropic)**:

**Areas where AI was consulted:**
- Accessibility implementation (ARIA labels, keyboard shortcuts, screen reader support)
- Regex pattern validation and edge case testing
- Responsive CSS Grid/Flexbox layouts
- Documentation structure and technical writing

**Independently developed:**
- Core application architecture and logic
- Transaction management system
- Data persistence strategy (localStorage)
- UI/UX design decisions
- Currency conversion implementation
- CSV export functionality
- Overall project concept and requirements

The use of AI tools was for learning, optimization, and ensuring best practices in web accessibility standards (WCAG 2.1 compliance).

---

## 🙏 Acknowledgments

Built with vanilla JavaScript, HTML5, and CSS3. No frameworks or libraries used.

**AI Assistance**: ARIA integration and accessibility enhancements were developed with assistance from Claude AI (Anthropic) to ensure WCAG compliance and best practices for screen reader support.

---

## 🤖 AI Attribution

This project utilized Claude AI for:
- ARIA label implementation and semantic HTML guidance
- Keyboard navigation patterns and accessibility shortcuts
- Screen reader announcement strategies
- Focus management best practices
- WCAG 2.1 compliance recommendations

Core application logic, UI design, and business functionality were independently developed.

---

**Last Updated**: October 2025
