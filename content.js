/* === SALMA & KHADIJA — SUMMER BRIDGE TO GRADE 7 ===
 * ESL-friendly, Math + English, no locked lessons.
 * Uses the LearnKit universal engine.
 */
window.LEARNKIT = {
  id: 'salma-khadija-g7-summer',
  title: 'Salma & Khadija — Summer Bridge to Grade 7',
  subtitle: 'Math + English practice. Pick your subject for today. Read aloud, play games, write, and grow.',
  sequential: false,
  unitLabel: 'Unit',
  lessonLabel: 'Lesson',
  theme: {
    primary: '#4f46e5',
    accent: '#f59e0b',
    bg: '#fefce8',
    card: '#ffffff',
    text: '#1e293b',
    muted: '#64748b',
    success: '#10b981',
    error: '#ef4444'
  },
  mascot: {
    name: 'Nova',
    emoji: '🌟',
    color: '#4f46e5'
  },
  units: [
    /* =================== MATH UNITS =================== */
    {
      title: 'Math 1: Positive & Negative Numbers',
      subject: 'Math',
      lessons: [
        {
          title: 'What Are Integers?',
          intro: 'Whole numbers and their opposites. We use them for temperature, money, and elevation.',
          winText: '🎉 You mastered the number line!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Integers on the Number Line',
              blocks: [
                { type: 'text', text: 'Integers are whole numbers and their opposites: ..., -2, -1, 0, 1, 2, ...' },
                { type: 'example', text: 'If it is 5°C above zero, we write +5. If it is 3°C below zero, we write -3.' },
                { type: 'vocab', word: 'integer', def: 'A whole number that can be positive, negative, or zero.' },
                { type: 'vocab', word: 'opposite', def: 'Two numbers the same distance from 0, but on different sides. The opposite of 4 is -4.' },
                { type: 'tip', text: 'Numbers to the right of 0 are positive. Numbers to the left of 0 are negative.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Name That Integer',
              questions: [
                { q: 'A fish is 8 meters below sea level. What integer describes this?', a: '-8', type: 'text' },
                { q: 'You earn $12. What integer describes this?', a: '12', type: 'text' },
                { q: 'The temperature drops 5 degrees. What integer shows the change?', a: '-5', type: 'text' },
                { q: 'What is the opposite of -7?', a: '7', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Sort Hot and Cold',
              mode: 'categorize',
              categories: ['Positive', 'Negative', 'Zero'],
              items: [
                { text: '+15', category: 'Positive' },
                { text: '-4', category: 'Negative' },
                { text: '0', category: 'Zero' },
                { text: '-22', category: 'Negative' },
                { text: '+3', category: 'Positive' },
                { text: '-100', category: 'Negative' }
              ]
            },
            {
              kind: 'activity',
              title: 'Elevator Mission',
              stages: [
                { text: 'Start on floor 0. Go up 4 floors. Where are you?', answer: '4' },
                { text: 'From floor 4, go down 7 floors. Where are you?', answer: '-3' },
                { text: 'From floor -3, go down 2 more floors. Where are you?', answer: '-5' },
                { text: 'From floor -5, go up 8 floors. Where are you?', answer: '3' }
              ]
            }
          ]
        },
        {
          title: 'Adding Integers',
          intro: 'Learn to add positive and negative numbers using the number line and simple rules.',
          winText: '🎉 You can add integers!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Rules for Adding Integers',
              blocks: [
                { type: 'text', text: 'Adding a positive number means move right on the number line. Adding a negative number means move left.' },
                { type: 'example', text: '3 + (-5): Start at 3, move 5 left. You land on -2.' },
                { type: 'example', text: '-4 + 7: Start at -4, move 7 right. You land on 3.' },
                { type: 'tip', text: 'If the signs are the same, add and keep the sign. If the signs are different, subtract and keep the sign of the bigger number.' },
                { type: 'vocab', word: 'sum', def: 'The answer when you add two or more numbers.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Add Integers',
              questions: [
                { q: '5 + (-3) = ?', a: '2', type: 'text' },
                { q: '-6 + (-2) = ?', a: '-8', type: 'text' },
                { q: '-4 + 9 = ?', a: '5', type: 'text' },
                { q: '7 + (-10) = ?', a: '-3', type: 'text' },
                { q: '-15 + 15 = ?', a: '0', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Number Line Jumps',
              mode: 'match',
              pairs: [
                { left: '2 + (-5)', right: '-3' },
                { left: '-3 + 8', right: '5' },
                { left: '-7 + (-4)', right: '-11' },
                { left: '6 + (-6)', right: '0' },
                { left: '-1 + 4', right: '3' }
              ]
            },
            {
              kind: 'activity',
              title: 'Bank Account Mission',
              stages: [
                { text: 'You have $20. You spend $7. What is your new balance? Write the addition problem.', answer: '13' },
                { text: 'You have -$5 (you owe $5). You earn $12. What is your balance?', answer: '7' },
                { text: 'You have $8. You spend $15. What is your balance?', answer: '-7' }
              ]
            }
          ]
        },
        {
          title: 'Subtracting Integers',
          intro: 'Subtraction is just adding the opposite. Turn every subtraction problem into an addition problem.',
          winText: '🎉 You can subtract integers!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Subtract by Adding the Opposite',
              blocks: [
                { type: 'text', text: 'To subtract a number, add its opposite.' },
                { type: 'example', text: '5 - 8 = 5 + (-8) = -3' },
                { type: 'example', text: '-2 - (-6) = -2 + 6 = 4' },
                { type: 'tip', text: 'Two minus signs next to each other become a plus sign.' },
                { type: 'vocab', word: 'difference', def: 'The answer when you subtract one number from another.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Rewrite and Solve',
              questions: [
                { q: '7 - 10 = ?', a: '-3', type: 'text' },
                { q: '-5 - (-3) = ?', a: '-2', type: 'text' },
                { q: '4 - (-6) = ?', a: '10', type: 'text' },
                { q: '-8 - 5 = ?', a: '-13', type: 'text' },
                { q: '0 - (-9) = ?', a: '9', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Temperature Drops',
              mode: 'categorize',
              categories: ['Answer is Positive', 'Answer is Negative'],
              items: [
                { text: '12 - 5', category: 'Answer is Positive' },
                { text: '3 - 10', category: 'Answer is Negative' },
                { text: '-4 - (-9)', category: 'Answer is Positive' },
                { text: '-1 - 6', category: 'Answer is Negative' }
              ]
            },
            {
              kind: 'activity',
              title: 'Thermometer Mission',
              stages: [
                { text: 'Morning temperature is -2°C. By noon it is 7°C. How much did it rise? Use subtraction.', answer: '9' },
                { text: 'Temperature is 5°C. It drops 11 degrees. What is the new temperature?', answer: '-6' },
                { text: 'Temperature is -8°C. It rises 8 degrees. What is the new temperature?', answer: '0' }
              ]
            }
          ]
        },
        {
          title: 'Multiplying & Dividing Integers',
          intro: 'Sign rules first, then multiply or divide the numbers normally.',
          winText: '🎉 You can multiply and divide integers!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Sign Rules',
              blocks: [
                { type: 'text', text: 'Same signs = positive answer. Different signs = negative answer.' },
                { type: 'example', text: '(-3) × (-4) = 12 (same signs, positive)' },
                { type: 'example', text: '(-3) × 4 = -12 (different signs, negative)' },
                { type: 'example', text: '-20 ÷ 5 = -4 (different signs, negative)' },
                { type: 'tip', text: 'An even number of negative signs gives a positive answer. An odd number gives negative.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Multiply and Divide',
              questions: [
                { q: '(-6) × 3 = ?', a: '-18', type: 'text' },
                { q: '(-7) × (-2) = ?', a: '14', type: 'text' },
                { q: '24 ÷ (-6) = ?', a: '-4', type: 'text' },
                { q: '(-35) ÷ (-7) = ?', a: '5', type: 'text' },
                { q: '(-9) × 0 = ?', a: '0', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Sign Sort',
              mode: 'categorize',
              categories: ['Positive Answer', 'Negative Answer', 'Zero'],
              items: [
                { text: '(-5) × (-3)', category: 'Positive Answer' },
                { text: '8 × (-2)', category: 'Negative Answer' },
                { text: '(-12) ÷ 4', category: 'Negative Answer' },
                { text: '(-9) × 0', category: 'Zero' },
                { text: '(-20) ÷ (-5)', category: 'Positive Answer' }
              ]
            },
            {
              kind: 'activity',
              title: 'Debt and Earnings Mission',
              stages: [
                { text: 'You lose $4 each day for 5 days. Write as multiplication. What is the total change?', answer: '-20' },
                { text: 'A fish swims down 3 meters each second. Where is it after 7 seconds?', answer: '-21' },
                { text: 'A company loses $30 over 6 days. What is the change each day?', answer: '-5' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Math 2: Ratios, Rates & Proportions',
      subject: 'Math',
      lessons: [
        {
          title: 'Understanding Ratios',
          intro: 'A ratio compares two quantities. It tells us "for every" or "out of."',
          winText: '🎉 You can read and write ratios!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Ratios in Real Life',
              blocks: [
                { type: 'text', text: 'A ratio compares two amounts. We can write 3 apples to 2 oranges as 3:2, 3 to 2, or 3/2.' },
                { type: 'example', text: 'In a class with 10 girls and 15 boys, the ratio of girls to boys is 10:15. We can simplify to 2:3.' },
                { type: 'vocab', word: 'ratio', def: 'A comparison of two quantities by division.' },
                { type: 'vocab', word: 'simplify', def: 'Make a ratio or fraction smaller by dividing both parts by the same number.' },
                { type: 'tip', text: 'Order matters! The ratio of cats to dogs is different from dogs to cats.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Write the Ratio',
              questions: [
                { q: 'There are 6 red pens and 4 blue pens. What is the ratio of red to blue?', a: '3:2', type: 'text' },
                { q: 'A recipe uses 2 cups flour and 1 cup sugar. What is the ratio of flour to sugar?', a: '2:1', type: 'text' },
                { q: 'Simplify the ratio 8:12.', a: '2:3', type: 'text' },
                { q: 'In a group of 9 students, 5 are girls. What is the ratio of girls to boys?', a: '5:4', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Ratio Match',
              mode: 'match',
              pairs: [
                { left: '4:6 simplified', right: '2:3' },
                { left: '9:3 simplified', right: '3:1' },
                { left: '10:15 simplified', right: '2:3' },
                { left: '6:8 simplified', right: '3:4' },
                { left: '12:4 simplified', right: '3:1' }
              ]
            },
            {
              kind: 'activity',
              title: 'Smoothie Recipe Mission',
              stages: [
                { text: 'A smoothie uses 3 bananas and 2 cups milk. Write the ratio of bananas to milk.', answer: '3:2' },
                { text: 'You double the recipe. Now how many bananas and cups of milk do you use?', answer: '6 bananas, 4 cups' },
                { text: 'What is the new ratio of bananas to milk?', answer: '3:2' }
              ]
            }
          ]
        },
        {
          title: 'Unit Rates',
          intro: 'A unit rate tells you how much for one. It makes comparisons easy.',
          winText: '🎉 You can find unit rates!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Finding Unit Rates',
              blocks: [
                { type: 'text', text: 'A rate compares two different quantities. A unit rate has a denominator of 1.' },
                { type: 'example', text: 'If 4 sandwiches cost $12, the unit price is $12 ÷ 4 = $3 per sandwich.' },
                { type: 'example', text: 'A car drives 180 miles in 3 hours. Unit rate = 180 ÷ 3 = 60 miles per hour.' },
                { type: 'vocab', word: 'unit rate', def: 'A rate for one unit of something, like one item, one hour, or one mile.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Find the Unit Rate',
              questions: [
                { q: '8 pencils cost $4. What is the cost per pencil?', a: '0.5', type: 'text' },
                { q: 'A car drives 240 miles in 4 hours. How many miles per hour?', a: '60', type: 'text' },
                { q: '5 kg of rice costs $15. What is the price per kg?', a: '3', type: 'text' },
                { q: 'A worker earns $80 in 8 hours. How much per hour?', a: '10', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Best Buy Game',
              mode: 'match',
              pairs: [
                { left: '6 apples for $3 → per apple', right: '$0.50' },
                { left: '10 apples for $5 → per apple', right: '$0.50' },
                { left: '4 bottles for $8 → per bottle', right: '$2.00' },
                { left: '5 bottles for $10 → per bottle', right: '$2.00' },
                { left: '3 hours for $45 → per hour', right: '$15' }
              ]
            },
            {
              kind: 'activity',
              title: 'Shopping Trip Mission',
              stages: [
                { text: 'Store A sells 6 notebooks for $9. Store B sells 4 notebooks for $6. Which store has the better unit price? (A or B)', answer: 'B' },
                { text: 'Juice A: 2 liters for $5. Juice B: 3 liters for $6. Which is cheaper per liter?', answer: 'B' }
              ]
            }
          ]
        },
        {
          title: 'Proportional Relationships',
          intro: 'When two quantities grow or shrink together at the same rate, they are proportional.',
          winText: '🎉 You found proportional relationships!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Tables, Graphs, and Equations',
              blocks: [
                { type: 'text', text: 'A proportional relationship passes through (0,0) on a graph and has a constant ratio.' },
                { type: 'example', text: 'If 1 apple costs $2, then 2 apples cost $4, 3 apples cost $6. The equation is cost = 2 × apples.' },
                { type: 'vocab', word: 'constant of proportionality', def: 'The number you multiply one quantity by to get the other. In cost = 2 × apples, the constant is 2.' },
                { type: 'tip', text: 'Check a table by dividing each pair. If the answer is always the same, it is proportional.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Find the Constant',
              questions: [
                { q: 'y = 5x. What is the constant of proportionality?', a: '5', type: 'text' },
                { q: 'Hours: 1, 2, 3. Pay: $8, $16, $24. What is the constant?', a: '8', type: 'text' },
                { q: 'If 4 notebooks cost $6, how much do 10 notebooks cost?', a: '15', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Proportional or Not?',
              mode: 'categorize',
              categories: ['Proportional', 'Not Proportional'],
              items: [
                { text: 'x=1,y=3; x=2,y=6; x=3,y=9', category: 'Proportional' },
                { text: 'x=1,y=4; x=2,y=7; x=3,y=10', category: 'Not Proportional' },
                { text: 'x=2,y=10; x=4,y=20; x=5,y=25', category: 'Proportional' }
              ]
            },
            {
              kind: 'activity',
              title: 'Cookie Bake Mission',
              stages: [
                { text: '1 batch makes 24 cookies. How many cookies do 3 batches make?', answer: '72' },
                { text: 'You need 144 cookies. How many batches do you need?', answer: '6' },
                { text: 'Write the equation: cookies = ___ × batches.', answer: '24' }
              ]
            }
          ]
        },
        {
          title: 'Percent Problems',
          intro: 'Percents are ratios out of 100. We use them for tax, tips, discounts, and growth.',
          winText: '🎉 You solved percent problems!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Percent as a Rate',
              blocks: [
                { type: 'text', text: 'Percent means "per 100." 20% = 20/100 = 0.20.' },
                { type: 'example', text: '20% of $50 = 0.20 × 50 = $10.' },
                { type: 'example', text: 'A $80 shirt is 25% off. Discount = 0.25 × 80 = $20. Sale price = $60.' },
                { type: 'tip', text: 'To find a percent of a number, change the percent to a decimal, then multiply.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Calculate the Percent',
              questions: [
                { q: 'What is 15% of 200?', a: '30', type: 'text' },
                { q: 'A $60 jacket is 20% off. What is the discount?', a: '12', type: 'text' },
                { q: 'You leave a 10% tip on a $40 meal. How much is the tip?', a: '4', type: 'text' },
                { q: '40 is what percent of 80?', a: '50', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Percent Match',
              mode: 'match',
              pairs: [
                { left: '25% of 80', right: '20' },
                { left: '50% of 90', right: '45' },
                { left: '10% of 300', right: '30' },
                { left: '75% of 40', right: '30' },
                { left: '20% of 50', right: '10' }
              ]
            },
            {
              kind: 'activity',
              title: 'Store Sale Mission',
              stages: [
                { text: 'A bike costs $200. It is 30% off. What is the sale price?', answer: '140' },
                { text: 'You buy a $25 book with 8% tax. How much tax do you pay?', answer: '2' },
                { text: 'A restaurant bill is $50. You tip 20%. What is the total with tip?', answer: '60' }
              ]
            }
          ]
        },
        {
          title: 'Percent Change',
          intro: 'Percent change tells us how much a number went up or down compared to the original.',
          winText: '🎉 You can find percent increase and decrease!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Percent Increase & Decrease',
              blocks: [
                { type: 'text', text: 'Percent change = (change amount ÷ original amount) × 100.' },
                { type: 'example', text: 'A plant grew from 20 cm to 25 cm. Change = 5. Percent increase = (5 ÷ 20) × 100 = 25%.' },
                { type: 'example', text: 'A price drops from $80 to $68. Change = $12. Percent decrease = (12 ÷ 80) × 100 = 15%.' },
                { type: 'tip', text: 'Always divide by the original amount, not the new amount.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Percent Change Drills',
              questions: [
                { q: 'A population grows from 100 to 120. What is the percent increase?', a: '20', type: 'text' },
                { q: 'A phone drops from $500 to $400. What is the percent decrease?', a: '20', type: 'text' },
                { q: 'A salary rises from $800 to $900. What is the percent increase?', a: '12.5', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Increase or Decrease?',
              mode: 'categorize',
              categories: ['Percent Increase', 'Percent Decrease'],
              items: [
                { text: '40 → 50', category: 'Percent Increase' },
                { text: '80 → 60', category: 'Percent Decrease' },
                { text: '25 → 30', category: 'Percent Increase' },
                { text: '100 → 85', category: 'Percent Decrease' }
              ]
            },
            {
              kind: 'activity',
              title: 'Plant Growth Mission',
              stages: [
                { text: 'A seedling is 10 cm tall. One week later it is 16 cm. What is the percent increase?', answer: '60' },
                { text: 'A water bottle has 500 ml. You drink 125 ml. What percent did you drink?', answer: '25' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Math 3: Expressions & Equations',
      subject: 'Math',
      lessons: [
        {
          title: 'Algebraic Expressions',
          intro: 'Use letters to stand for unknown numbers. Then combine and simplify.',
          winText: '🎉 You can work with expressions!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Variables and Terms',
              blocks: [
                { type: 'text', text: 'A variable is a letter that stands for a number. An expression is a math phrase without an equals sign.' },
                { type: 'example', text: '3x + 5 means "3 times a number, plus 5."' },
                { type: 'example', text: 'Like terms have the same variable. 4x and 7x are like terms. 4x and 5 are not.' },
                { type: 'vocab', word: 'coefficient', def: 'The number in front of a variable. In 8y, the coefficient is 8.' },
                { type: 'tip', text: 'Only combine like terms. Keep the sign in front of each term.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Simplify Expressions',
              questions: [
                { q: 'Simplify: 3x + 5x', a: '8x', type: 'text' },
                { q: 'Simplify: 7y - 2y', a: '5y', type: 'text' },
                { q: 'Simplify: 4a + 6 + 2a', a: '6a+6', type: 'text' },
                { q: 'Simplify: 9m - 4 - 3m + 7', a: '6m+3', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Like Terms Match',
              mode: 'match',
              pairs: [
                { left: '5x + 2x', right: '7x' },
                { left: '8n - 3n', right: '5n' },
                { left: '4 + 4x + 6', right: '4x+10' },
                { left: '7y - y', right: '6y' }
              ]
            },
            {
              kind: 'activity',
              title: 'Expression Builder Mission',
              stages: [
                { text: 'You buy 3 notebooks at $x each and a $2 pen. Write an expression for the total cost.', answer: '3x+2' },
                { text: 'If x = $4, what is the total cost?', answer: '14' }
              ]
            }
          ]
        },
        {
          title: 'Expanding & Factoring',
          intro: 'Use the distributive property to expand and factor expressions.',
          winText: '🎉 You can expand and factor!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'The Distributive Property',
              blocks: [
                { type: 'text', text: 'Multiply the outside number by each term inside the parentheses.' },
                { type: 'example', text: '2(x + 3) = 2x + 6' },
                { type: 'example', text: '4(2x - 5) = 8x - 20' },
                { type: 'vocab', word: 'factor', def: 'To write an expression as a product. 6x + 9 = 3(2x + 3).' },
                { type: 'tip', text: 'To factor, find the biggest number that divides all terms.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Expand and Factor',
              questions: [
                { q: 'Expand: 3(x + 4)', a: '3x+12', type: 'text' },
                { q: 'Expand: 5(2x - 1)', a: '10x-5', type: 'text' },
                { q: 'Factor: 6x + 12', a: '6(x+2)', type: 'text' },
                { q: 'Factor: 8x - 4', a: '4(2x-1)', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Expand Match',
              mode: 'match',
              pairs: [
                { left: '2(x + 5)', right: '2x+10' },
                { left: '4(3x - 2)', right: '12x-8' },
                { left: '7(x + 1)', right: '7x+7' },
                { left: '3(2x + 4)', right: '6x+12' }
              ]
            },
            {
              kind: 'activity',
              title: 'Gift Box Mission',
              stages: [
                { text: 'Each gift box has x stickers and 3 candies. Write an expression for 5 boxes.', answer: '5x+15' },
                { text: 'Each bag has 4 toy cars and 2 stickers. Write an expression for 6 bags.', answer: '24+12' }
              ]
            }
          ]
        },
        {
          title: 'Solving Two-Step Equations',
          intro: 'Undo operations step by step to find the value of the variable.',
          winText: '🎉 You can solve two-step equations!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Reverse Operations',
              blocks: [
                { type: 'text', text: 'To solve an equation, do the opposite operation to isolate the variable.' },
                { type: 'example', text: '2x + 5 = 13. First subtract 5: 2x = 8. Then divide by 2: x = 4.' },
                { type: 'example', text: 'x/3 - 2 = 4. First add 2: x/3 = 6. Then multiply by 3: x = 18.' },
                { type: 'tip', text: 'Use reverse PEMDAS: undo addition/subtraction first, then multiplication/division.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Solve for x',
              questions: [
                { q: '3x + 4 = 16', a: '4', type: 'text' },
                { q: '2x - 7 = 9', a: '8', type: 'text' },
                { q: 'x/5 + 3 = 8', a: '25', type: 'text' },
                { q: '4x + 2 = 22', a: '5', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Equation Steps',
              mode: 'dragSort',
              items: [
                { text: '2x + 6 = 14', order: 0 },
                { text: 'Subtract 6 from both sides', order: 1 },
                { text: '2x = 8', order: 2 },
                { text: 'Divide both sides by 2', order: 3 },
                { text: 'x = 4', order: 4 }
              ]
            },
            {
              kind: 'activity',
              title: 'Phone Bill Mission',
              stages: [
                { text: 'Your phone plan costs $20 plus $10 per GB. The bill is $60. Write and solve: 20 + 10g = 60.', answer: '4' },
                { text: 'A gym charges $30 plus $5 per class. You paid $55. How many classes? 30 + 5c = 55', answer: '5' }
              ]
            }
          ]
        },
        {
          title: 'Inequalities',
          intro: 'Inequalities compare values. The solution is a range of numbers, not just one.',
          winText: '🎉 You can solve and graph inequalities!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Solving Simple Inequalities',
              blocks: [
                { type: 'text', text: 'Solve inequalities like equations, but flip the sign if you multiply or divide by a negative number.' },
                { type: 'example', text: 'x + 3 > 7 → x > 4' },
                { type: 'example', text: '2x ≤ 10 → x ≤ 5' },
                { type: 'example', text: '-3x > 12 → x < -4 (sign flips!)' },
                { type: 'vocab', word: 'inequality', def: 'A math sentence that uses <, >, ≤, ≥, or ≠.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Solve the Inequality',
              questions: [
                { q: 'x + 5 > 12', a: 'x>7', type: 'text' },
                { q: '3x ≤ 18', a: 'x≤6', type: 'text' },
                { q: 'x - 4 < 9', a: 'x<13', type: 'text' },
                { q: '-2x > 10', a: 'x<-5', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Inequality Match',
              mode: 'match',
              pairs: [
                { left: 'x + 2 > 6', right: 'x > 4' },
                { left: '4x ≤ 20', right: 'x ≤ 5' },
                { left: 'x - 3 < 7', right: 'x < 10' },
                { left: '-5x ≥ 15', right: 'x ≤ -3' }
              ]
            },
            {
              kind: 'activity',
              title: 'Budget Mission',
              stages: [
                { text: 'You have $50. A game costs $10 and each movie ticket costs $8. How many tickets can you buy? Write: 10 + 8t ≤ 50.', answer: '5' },
                { text: 'You need at least 80 points to pass. Each question gives 4 points. How many questions? Write: 4q ≥ 80.', answer: '20' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Math 4: Geometry',
      subject: 'Math',
      lessons: [
        {
          title: 'Scale Drawings',
          intro: 'A scale drawing is a picture that is bigger or smaller than the real thing, but keeps the same shape.',
          winText: '🎉 You can read scale drawings!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Using a Scale',
              blocks: [
                { type: 'text', text: 'Scale tells you the ratio of the drawing to real life. 1 cm : 5 m means 1 cm on paper = 5 m in real life.' },
                { type: 'example', text: 'A room is 4 cm long on a scale drawing with scale 1 cm : 2 m. Real length = 4 × 2 = 8 m.' },
                { type: 'tip', text: 'Multiply to go from drawing to real. Divide to go from real to drawing.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Scale Drills',
              questions: [
                { q: 'Scale 1 cm : 3 m. Drawing length is 5 cm. Real length?', a: '15', type: 'text' },
                { q: 'Scale 1 cm : 4 m. Real length is 24 m. Drawing length?', a: '6', type: 'text' },
                { q: 'Scale 1 inch : 10 feet. Drawing is 7 inches. Real length?', a: '70', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Map Match',
              mode: 'match',
              pairs: [
                { left: '1 cm : 2 m, drawing 6 cm', right: '12 m' },
                { left: '1 cm : 5 m, real 25 m', right: '5 cm' },
                { left: '1 inch : 8 ft, drawing 4 in', right: '32 ft' }
              ]
            },
            {
              kind: 'activity',
              title: 'Dream Room Mission',
              stages: [
                { text: 'Your bedroom drawing is 8 cm by 6 cm. Scale is 1 cm : 1 m. What is the real area in square meters?', answer: '48' },
                { text: 'A garden plan is 5 cm by 4 cm. Scale is 1 cm : 2 m. What is the real perimeter?', answer: '36' }
              ]
            }
          ]
        },
        {
          title: 'Circles: Area & Circumference',
          intro: 'Learn the two main circle formulas and when to use them.',
          winText: '🎉 You can work with circles!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Pi, Radius, and Diameter',
              blocks: [
                { type: 'text', text: 'Circumference is the distance around a circle. Area is the space inside.' },
                { type: 'example', text: 'C = 2πr and A = πr². Use π ≈ 3.14.' },
                { type: 'example', text: 'A circle with radius 3 has area = 3.14 × 3 × 3 = 28.26.' },
                { type: 'vocab', word: 'radius', def: 'The distance from the center to the edge of a circle.' },
                { type: 'vocab', word: 'diameter', def: 'The distance across a circle through the center. Diameter = 2 × radius.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Circle Calculations',
              questions: [
                { q: 'Radius = 4. Find circumference. (Use 3.14 for π)', a: '25.12', type: 'text' },
                { q: 'Radius = 5. Find area. (Use 3.14 for π)', a: '78.5', type: 'text' },
                { q: 'Diameter = 10. Find area.', a: '78.5', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Formula Match',
              mode: 'match',
              pairs: [
                { left: 'Find distance around circle', right: 'C = 2πr' },
                { left: 'Find space inside circle', right: 'A = πr²' },
                { left: 'Half of diameter', right: 'radius' }
              ]
            },
            {
              kind: 'activity',
              title: 'Pizza Mission',
              stages: [
                { text: 'A pizza has radius 8 inches. What is its area?', answer: '200.96' },
                { text: 'A running track is a circle with radius 30 m. How far do you run in one lap?', answer: '188.4' }
              ]
            }
          ]
        },
        {
          title: 'Angles & Shapes',
          intro: 'Find missing angles using facts about complementary, supplementary, and vertical angles.',
          winText: '🎉 You can solve angle puzzles!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Angle Relationships',
              blocks: [
                { type: 'text', text: 'Complementary angles add to 90°. Supplementary angles add to 180°. Vertical angles are equal.' },
                { type: 'example', text: 'If one angle is 35°, its complement is 90 - 35 = 55°.' },
                { type: 'example', text: 'Two supplementary angles are 120° and x. x = 180 - 120 = 60°.' },
                { type: 'vocab', word: 'adjacent angles', def: 'Angles next to each other that share a side and a vertex.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Find the Missing Angle',
              questions: [
                { q: 'Find the complement of 25°.', a: '65', type: 'text' },
                { q: 'Find the supplement of 70°.', a: '110', type: 'text' },
                { q: 'Two vertical angles are shown. One is 40°. What is the other?', a: '40', type: 'text' },
                { q: 'A triangle has angles 50° and 60°. Find the third angle.', a: '70', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Angle Sort',
              mode: 'categorize',
              categories: ['Complementary', 'Supplementary', 'Vertical'],
              items: [
                { text: 'Two angles add to 90°', category: 'Complementary' },
                { text: 'Two angles across from each other at an X', category: 'Vertical' },
                { text: 'Two angles add to 180°', category: 'Supplementary' }
              ]
            },
            {
              kind: 'activity',
              title: 'Bridge Builder Mission',
              stages: [
                { text: 'A bridge beam makes a 35° angle with the road. What angle does it make with the vertical support?', answer: '55' },
                { text: 'Two beams cross. One angle is 110°. What is the angle next to it on a straight line?', answer: '70' }
              ]
            }
          ]
        },
        {
          title: 'Area, Volume & Surface Area',
          intro: 'Find the space inside and the space around 2D and 3D shapes.',
          winText: '🎉 You can measure 2D and 3D shapes!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Composite Figures',
              blocks: [
                { type: 'text', text: 'Break a shape into simpler shapes. Find each area, then add or subtract.' },
                { type: 'example', text: 'A rectangle 8×5 with a triangle on top (base 8, height 3). Area = 40 + 12 = 52.' },
                { type: 'vocab', word: 'surface area', def: 'The total area of all the faces of a 3D shape.' },
                { type: 'vocab', word: 'volume', def: 'The amount of space inside a 3D shape.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Area and Volume',
              questions: [
                { q: 'A rectangular prism is 4×3×5. What is its volume?', a: '60', type: 'text' },
                { q: 'Find the area of a triangle with base 10 and height 4.', a: '20', type: 'text' },
                { q: 'A cube has side length 3. What is its surface area?', a: '54', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Formula Match',
              mode: 'match',
              pairs: [
                { left: 'Area of rectangle', right: 'length × width' },
                { left: 'Volume of prism', right: 'length × width × height' },
                { left: 'Area of triangle', right: '1/2 × base × height' },
                { left: 'Surface area of cube', right: '6 × side²' }
              ]
            },
            {
              kind: 'activity',
              title: 'Aquarium Mission',
              stages: [
                { text: 'A fish tank is 6 dm long, 4 dm wide, and 5 dm high. How many liters of water can it hold? (1 dm³ = 1 L)', answer: '120' },
                { text: 'You want to paint the outside of a box that is 5×4×3. What is the surface area?', answer: '94' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Math 5: Statistics & Probability',
      subject: 'Math',
      lessons: [
        {
          title: 'Sampling & Data',
          intro: 'Learn how to collect data and make good guesses about a big group from a small sample.',
          winText: '🎉 You understand sampling!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Samples and Populations',
              blocks: [
                { type: 'text', text: 'A population is the whole group. A sample is a small part of the group. A good sample is random and representative.' },
                { type: 'example', text: 'To find the favorite fruit in a school, asking only grade 7 students is not representative of the whole school.' },
                { type: 'vocab', word: 'random sample', def: 'A sample where every member of the population has an equal chance of being chosen.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Sampling Questions',
              questions: [
                { q: 'You want to know the average height of students in a school. You only measure the basketball team. Is this a good sample?', a: 'no', type: 'text' },
                { q: 'You pick 50 students randomly from all grades. Is this a good sample?', a: 'yes', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Good or Bad Sample?',
              mode: 'categorize',
              categories: ['Good Sample', 'Bad Sample'],
              items: [
                { text: 'Survey every 10th person entering the library', category: 'Good Sample' },
                { text: 'Ask only your friends', category: 'Bad Sample' },
                { text: 'Randomly pick from a full student list', category: 'Good Sample' },
                { text: 'Only ask students in the cafeteria at lunch', category: 'Bad Sample' }
              ]
            },
            {
              kind: 'activity',
              title: 'School Survey Mission',
              stages: [
                { text: 'Design a survey to find the favorite sport in your school. Describe a good sample.', answer: 'random sample of all grades' },
                { text: 'You sample 40 students. 10 choose soccer. Predict how many out of 400 students choose soccer.', answer: '100' }
              ]
            }
          ]
        },
        {
          title: 'Probability Basics',
          intro: 'Probability tells us how likely something is to happen. It is always between 0 and 1.',
          winText: '🎉 You can find probability!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Likelihood',
              blocks: [
                { type: 'text', text: 'Probability = (number of ways it can happen) ÷ (total number of possible outcomes).' },
                { type: 'example', text: 'A bag has 3 red and 7 blue marbles. P(red) = 3/10 = 0.3 = 30%.' },
                { type: 'tip', text: 'Probability near 0 means unlikely. Near 1 means likely. 1/2 means equal chance.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Find the Probability',
              questions: [
                { q: 'A die is rolled. What is the probability of rolling a 3?', a: '1/6', type: 'text' },
                { q: 'A spinner has 5 equal sections: 2 red, 1 blue, 2 green. P(blue)?', a: '1/5', type: 'text' },
                { q: 'A bag has 4 yellow and 6 black marbles. P(yellow)?', a: '2/5', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Probability Match',
              mode: 'match',
              pairs: [
                { left: 'Impossible', right: '0' },
                { left: 'Certain', right: '1' },
                { left: 'Even chance', right: '1/2' },
                { left: 'Unlikely', right: 'close to 0' }
              ]
            },
            {
              kind: 'activity',
              title: 'Game Night Mission',
              stages: [
                { text: 'You have cards numbered 1 to 10. What is the probability of picking an even number?', answer: '1/2' },
                { text: 'What is the probability of picking a number greater than 7?', answer: '3/10' }
              ]
            }
          ]
        },
        {
          title: 'Compound Events',
          intro: 'When two or more things happen together, we count outcomes with lists, tables, or tree diagrams.',
          winText: '🎉 You can find compound probability!',
          tags: ['Math'],
          phases: [
            {
              kind: 'lesson',
              subject: 'Math',
              title: 'Counting Outcomes',
              blocks: [
                { type: 'text', text: 'Compound events combine two or more simple events. We can use organized lists, tables, or tree diagrams to count outcomes.' },
                { type: 'example', text: 'Flip a coin and roll a die. Outcomes: H1, H2, H3, H4, H5, H6, T1, T2, T3, T4, T5, T6. Total = 12.' },
                { type: 'tip', text: 'Multiply the number of choices at each step to find total outcomes.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'Math',
              title: 'Count Outcomes',
              questions: [
                { q: 'You flip 2 coins. How many possible outcomes?', a: '4', type: 'text' },
                { q: 'You roll a die and spin a 4-color spinner. How many outcomes?', a: '24', type: 'text' },
                { q: 'A restaurant has 3 appetizers and 4 main dishes. How many meals?', a: '12', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'Math',
              title: 'Tree Diagram Match',
              mode: 'match',
              pairs: [
                { left: '2 shirts × 3 pants', right: '6 outfits' },
                { left: 'Coin × 3 flavors', right: '6 outcomes' },
                { left: '3 dice rolls', right: '27 outcomes' }
              ]
            },
            {
              kind: 'activity',
              title: 'Ice Cream Mission',
              stages: [
                { text: 'An ice cream shop has 2 cone types and 5 flavors. How many different cones?', answer: '10' },
                { text: 'You pick 2 scoops of different flavors from 4 flavors. How many ways?', answer: '6' }
              ]
            }
          ]
        }
      ]
    },
    /* =================== ELA UNITS =================== */
    {
      title: 'English 1: Reading Like a Detective',
      subject: 'ELA',
      lessons: [
        {
          title: 'Find the Evidence',
          intro: 'Good readers use proof from the text to support their ideas.',
          winText: '🎉 You found text evidence!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Cite Text Evidence',
              blocks: [
                { type: 'text', text: 'Text evidence is words, phrases, or sentences from the passage that support your answer.' },
                { type: 'example', text: 'Question: How does Maria feel? Evidence: "Maria smiled and hugged her sister."' },
                { type: 'vocab', word: 'cite', def: 'To point to a specific part of the text as proof.' },
                { type: 'tip', text: 'Use sentence frames: "The text says..." or "For example, the author writes..."' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Pick the Best Evidence',
              questions: [
                { q: 'Claim: The dog is friendly. Which is the best evidence? A) The dog barked. B) The dog wagged its tail and licked the girl\'s hand.', a: 'B', type: 'text' },
                { q: 'Claim: It was raining hard. Best evidence? A) Puddles filled the street. B) The sun was bright.', a: 'A', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Match Claim to Evidence',
              mode: 'match',
              pairs: [
                { left: 'The test was difficult', right: '"Only three students finished on time."' },
                { left: 'The forest was peaceful', right: '"Birds sang softly in the trees."' },
                { left: 'The soup was too salty', right: '"Everyone reached for their water glass."' }
              ]
            },
            {
              kind: 'activity',
              title: 'Evidence Hunt Mission',
              stages: [
                { text: 'Read: "Jamal studied every night. He got the highest score in the class." Write one piece of evidence that shows Jamal worked hard.', answer: 'studied every night' },
                { text: 'Read: "The old house creaked in the wind. A loose shutter banged against the wall." Write one detail that creates a scary mood.', answer: 'creaked in the wind' }
              ]
            }
          ]
        },
        {
          title: 'Central Idea vs. Theme',
          intro: 'Central idea is what a nonfiction text is mostly about. Theme is the big life lesson in a story.',
          winText: '🎉 You can find central idea and theme!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Main Message',
              blocks: [
                { type: 'text', text: 'Central idea = the most important point in an informational text. Theme = the message about life in a story.' },
                { type: 'example', text: 'Article about recycling: Central idea = "Recycling helps protect the environment."' },
                { type: 'example', text: 'Story about a girl who never gives up: Theme = "Hard work leads to success."' },
                { type: 'tip', text: 'A theme is usually a sentence, not just one word.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Identify Central Idea or Theme',
              questions: [
                { q: 'A story shows a boy sharing his food with a stranger. Theme?', a: 'kindness', type: 'text' },
                { q: 'An article explains how exercise improves sleep, mood, and energy. Central idea?', a: 'exercise is good for you', type: 'text' },
                { q: 'A story shows a character learning to be brave. Theme?', a: 'courage', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Central Idea or Theme?',
              mode: 'categorize',
              categories: ['Central Idea', 'Theme'],
              items: [
                { text: 'Dogs make excellent pets because they are loyal and friendly.', category: 'Central Idea' },
                { text: 'True friendship means standing by someone even when things are hard.', category: 'Theme' },
                { text: 'Solar energy is clean, cheap, and renewable.', category: 'Central Idea' },
                { text: 'Honesty is always better than lies.', category: 'Theme' }
              ]
            },
            {
              kind: 'activity',
              title: 'Summary Mission',
              stages: [
                { text: 'Read: "Many students feel nervous before a test. Deep breathing, good sleep, and preparation can help." Write the central idea in one sentence.', answer: 'students can reduce test anxiety with breathing sleep and preparation' },
                { text: 'Read: "Lila was afraid of water, but her coach encouraged her every day. After months of practice, she won a race." Write a theme.', answer: 'practice and support help you overcome fear' }
              ]
            }
          ]
        },
        {
          title: 'Inferences',
          intro: 'An inference is a smart guess based on clues from the text plus what you already know.',
          winText: '🎉 You can make inferences!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Reading Between the Lines',
              blocks: [
                { type: 'text', text: 'Authors do not always tell us everything. We use clues + background knowledge to figure things out.' },
                { type: 'example', text: 'Text: "Maya zipped her jacket and shivered." Inference: It is cold outside.' },
                { type: 'tip', text: 'Ask: What does the text say? What do I already know? What can I figure out?' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Make an Inference',
              questions: [
                { q: 'Text: "Tom\'s hands were covered in flour and chocolate." What can you infer?', a: 'he was baking', type: 'text' },
                { q: 'Text: "The classroom was silent. Everyone stared at the broken window." What can you infer?', a: 'someone broke it', type: 'text' },
                { q: 'Text: "Her eyes filled with tears as she read the letter." What can you infer?', a: 'she is sad or emotional', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Clue + Inference Match',
              mode: 'match',
              pairs: [
                { left: 'He carried an umbrella and boots.', right: 'It is raining or about to rain.' },
                { left: 'She smiled when she saw her grade.', right: 'She did well on the test.' },
                { left: 'The dog barked at the stranger.', right: 'The dog does not know the person.' }
              ]
            },
            {
              kind: 'activity',
              title: 'Detective Mission',
              stages: [
                { text: 'Read: "The kitchen smelled like garlic and tomatoes. A pot bubbled on the stove." What is happening? Use the word "cooking" in your answer.', answer: 'someone is cooking' },
                { text: 'Read: "He looked at his watch and ran toward the bus stop." What can you infer?', answer: 'he is late for the bus' }
              ]
            }
          ]
        },
        {
          title: 'Author\'s Purpose & Point of View',
          intro: 'Why did the author write this? What does the author think?',
          winText: '🎉 You can analyze the author!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Why Was This Written?',
              blocks: [
                { type: 'text', text: 'Authors write to inform, persuade, entertain, or explain. Their word choice shows their point of view.' },
                { type: 'example', text: 'An ad says, "The best phone ever!" Purpose: persuade. Point of view: the phone is amazing.' },
                { type: 'vocab', word: 'purpose', def: 'The reason the author wrote the text.' },
                { type: 'vocab', word: 'point of view', def: 'What the author thinks or feels about the topic.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Find Purpose and Viewpoint',
              questions: [
                { q: 'A text lists facts about how volcanoes form. Purpose?', a: 'inform', type: 'text' },
                { q: 'A story makes you laugh about a silly dog. Purpose?', a: 'entertain', type: 'text' },
                { q: 'An essay says, "School should start later because students need sleep." Purpose?', a: 'persuade', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Purpose Sort',
              mode: 'categorize',
              categories: ['Inform', 'Persuade', 'Entertain'],
              items: [
                { text: 'A recipe with ingredients and steps', category: 'Inform' },
                { text: 'A funny story about a cat', category: 'Entertain' },
                { text: 'A poster asking you to vote', category: 'Persuade' },
                { text: 'A news article about a storm', category: 'Inform' }
              ]
            },
            {
              kind: 'activity',
              title: 'Ad Analyzer Mission',
              stages: [
                { text: 'Read: "Buy Fresh Smile toothpaste! It is the strongest and whitens teeth in one week." What is the purpose?', answer: 'persuade' },
                { text: 'What is the author\'s point of view about this toothpaste?', answer: 'it is the best' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'English 2: Paragraph Power',
      subject: 'ELA',
      lessons: [
        {
          title: 'Topic Sentences',
          intro: 'Every paragraph needs a clear main idea. Start with a strong topic sentence.',
          winText: '🎉 You can write topic sentences!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'The Heart of the Paragraph',
              blocks: [
                { type: 'text', text: 'A topic sentence tells the reader what the paragraph is about. It is usually the first sentence.' },
                { type: 'example', text: 'Topic: My favorite season. Topic sentence: "Winter is my favorite season because it brings snow, holidays, and hot chocolate."' },
                { type: 'tip', text: 'A good topic sentence is specific. It should not be too broad or too narrow.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Strong or Weak Topic Sentence?',
              questions: [
                { q: 'Topic: dogs. Sentence: "Dogs are good." Strong or weak?', a: 'weak', type: 'text' },
                { q: 'Topic: dogs. Sentence: "Dogs make great pets because they are loyal, playful, and protective." Strong or weak?', a: 'strong', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Match Topic to Sentence',
              mode: 'match',
              pairs: [
                { left: 'Why reading is important', right: 'Reading opens doors to new ideas and adventures.' },
                { left: 'My favorite food', right: 'Pizza is my favorite food because it is cheesy, warm, and customizable.' },
                { left: 'School uniforms', right: 'School uniforms help students focus on learning instead of clothes.' }
              ]
            },
            {
              kind: 'activity',
              title: 'Topic Sentence Mission',
              stages: [
                { text: 'Write a topic sentence about why summer is fun.', answer: 'summer is fun because' },
                { text: 'Write a topic sentence about the benefits of exercise.', answer: 'exercise is important because' }
              ]
            }
          ]
        },
        {
          title: 'Supporting Details',
          intro: 'Details explain, prove, or describe your topic sentence. Without details, your paragraph is empty.',
          winText: '🎉 You can add strong details!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Facts, Examples, and Explanations',
              blocks: [
                { type: 'text', text: 'Supporting details can be facts, examples, quotes, reasons, or descriptions.' },
                { type: 'example', text: 'Topic sentence: "Reading helps you learn new words." Detail: "When I read Harry Potter, I learned words like "muggle" and "quidditch."' },
                { type: 'tip', text: 'Each detail should connect back to the topic sentence.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Find the Detail',
              questions: [
                { q: 'Topic sentence: "My city has many parks." Which detail fits best? A) The library is large. B) Central Park has a lake and playground.', a: 'B', type: 'text' },
                { q: 'Topic sentence: "Homework helps students review." Which detail fits? A) It takes time. B) It gives students a chance to practice skills.', a: 'B', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Add a Detail',
              mode: 'match',
              pairs: [
                { left: 'Topic: my best friend is kind', right: 'She always shares her lunch with classmates.' },
                { left: 'Topic: video games can teach skills', right: 'Puzzle games help players solve problems.' },
                { left: 'Topic: cats are clean pets', right: 'They wash themselves with their tongues.' }
              ]
            },
            {
              kind: 'activity',
              title: 'Detail Builder Mission',
              stages: [
                { text: 'Topic sentence: "Walking is great exercise." Write one supporting detail.', answer: 'walking strengthens your heart' },
                { text: 'Topic sentence: "My grandmother is a great cook." Write one supporting detail.', answer: 'she makes delicious rice' }
              ]
            }
          ]
        },
        {
          title: 'Transitions & Concluding Sentences',
          intro: 'Transitions connect your ideas. A conclusion wraps up your paragraph.',
          winText: '🎉 You can connect and close paragraphs!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Glue Words and Closing Sentences',
              blocks: [
                { type: 'text', text: 'Transitions like first, next, also, because, and therefore help sentences flow.' },
                { type: 'example', text: '"First, exercise improves your health. Also, it boosts your mood."' },
                { type: 'example', text: 'A concluding sentence restates the main idea in a new way.' },
                { type: 'vocab', word: 'transition', def: 'A word or phrase that connects ideas.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Choose the Transition',
              questions: [
                { q: 'I like pizza. ____, I like pasta. (also / however)', a: 'also', type: 'text' },
                { q: 'She studied hard. ____, she passed the test. (therefore / first)', a: 'therefore', type: 'text' },
                { q: 'First, mix the flour. ____, add the eggs. (Finally / Next)', a: 'Next', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Transition Match',
              mode: 'match',
              pairs: [
                { left: 'To add an idea', right: 'also' },
                { left: 'To show contrast', right: 'however' },
                { left: 'To show result', right: 'therefore' },
                { left: 'To show time order', right: 'next' }
              ]
            },
            {
              kind: 'activity',
              title: 'Paragraph Polish Mission',
              stages: [
                { text: 'Write a concluding sentence for this topic: "Dogs are loyal animals."', answer: 'dogs are loyal animals' },
                { text: 'Add a transition to connect: "I like reading. ____ , I enjoy writing."', answer: 'also' }
              ]
            }
          ]
        },
        {
          title: 'RACCE Paragraphs',
          intro: 'Use the RACCE formula to write strong answers to reading questions.',
          winText: '🎉 You can write RACCE paragraphs!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Restate, Answer, Cite, Cite, Explain',
              blocks: [
                { type: 'text', text: 'RACCE helps you answer questions with a complete paragraph.' },
                { type: 'example', text: 'R: The author believes school should start later. A: Later start times help students sleep more. C: The text says, "Teenagers need 8-10 hours of sleep." C: It also says, "Students with later start times score higher on tests." E: This shows that more sleep improves learning.' },
                { type: 'tip', text: 'Use two pieces of evidence for stronger support.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Name the RACCE Part',
              questions: [
                { q: '"The text states..." Which RACCE part?', a: 'cite', type: 'text' },
                { q: '"This proves that..." Which RACCE part?', a: 'explain', type: 'text' },
                { q: '"In my opinion..." Which RACCE part?', a: 'answer', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Build a RACCE Paragraph',
              mode: 'dragSort',
              items: [
                { text: 'Restate the question', order: 0 },
                { text: 'Answer the question', order: 1 },
                { text: 'Cite evidence from the text', order: 2 },
                { text: 'Cite a second piece of evidence', order: 3 },
                { text: 'Explain how the evidence supports your answer', order: 4 }
              ]
            },
            {
              kind: 'activity',
              title: 'RACCE Writing Mission',
              stages: [
                { text: 'Prompt: Why is exercise important? Use the RACCE format. Write your answer sentence here.', answer: 'exercise is important because' },
                { text: 'Now cite one fact about exercise.', answer: 'exercise makes your heart strong' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'English 3: Argumentative Writing',
      subject: 'ELA',
      lessons: [
        {
          title: 'Writing a Claim',
          intro: 'A claim is your opinion or main argument. It must be clear and debatable.',
          winText: '🎉 You can write a strong claim!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'What Is a Claim?',
              blocks: [
                { type: 'text', text: 'A claim is the main point of your argument. Someone should be able to disagree with it.' },
                { type: 'example', text: 'Weak claim: "School is important." Strong claim: "Schools should require students to wear uniforms because uniforms reduce bullying and save money."' },
                { type: 'vocab', word: 'claim', def: 'A statement that someone argues is true.' },
                { type: 'tip', text: 'A strong claim has a topic and at least two reasons.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Strong or Weak Claim?',
              questions: [
                { q: '"Chocolate is a flavor." Strong or weak?', a: 'weak', type: 'text' },
                { q: '"Chocolate ice cream is the best dessert because it is creamy and tastes great." Strong or weak?', a: 'strong', type: 'text' },
                { q: '"Phones should be allowed in schools because they help with research and emergencies." Strong or weak?', a: 'strong', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Claim Match',
              mode: 'match',
              pairs: [
                { left: 'Topic: homework', right: 'Students should have less homework to allow time for sleep and family.' },
                { left: 'Topic: recess', right: 'Middle schools should keep recess because it improves focus and health.' },
                { left: 'Topic: pets', right: 'Families should adopt pets from shelters instead of buying from stores.' }
              ]
            },
            {
              kind: 'activity',
              title: 'Claim Builder Mission',
              stages: [
                { text: 'Topic: Should students have a longer lunch? Write a strong claim.', answer: 'students should have a longer lunch because' },
                { text: 'Topic: Should schools teach coding? Write a strong claim.', answer: 'schools should teach coding because' }
              ]
            }
          ]
        },
        {
          title: 'Reasons & Evidence',
          intro: 'A good argument gives reasons and proof to support the claim.',
          winText: '🎉 You can support a claim!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Reasons + Evidence = Strong Argument',
              blocks: [
                { type: 'text', text: 'Reasons explain why your claim is true. Evidence is proof, such as facts, examples, or expert opinions.' },
                { type: 'example', text: 'Claim: Schools should start later. Reason 1: Students need more sleep. Evidence: The American Academy of Pediatrics recommends 8-10 hours.' },
                { type: 'tip', text: 'Each body paragraph should have one reason and at least one piece of evidence.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Reason or Evidence?',
              questions: [
                { q: '"Reading improves vocabulary." Reason or evidence?', a: 'reason', type: 'text' },
                { q: '"A 2020 study found that students who read 20 minutes a day scored higher on tests." Reason or evidence?', a: 'evidence', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Match Reason to Evidence',
              mode: 'match',
              pairs: [
                { left: 'Reason: Exercise reduces stress', right: 'Evidence: A study found that 30 minutes of walking lowered stress by 20%.' },
                { left: 'Reason: Recycling protects oceans', right: 'Evidence: Plastic waste kills over 100,000 sea animals each year.' },
                { left: 'Reason: Healthy food improves focus', right: 'Evidence: Students who ate breakfast scored 10% higher on quizzes.' }
              ]
            },
            {
              kind: 'activity',
              title: 'Argument Map Mission',
              stages: [
                { text: 'Claim: Students should do chores at home. Write one reason.', answer: 'chores teach responsibility' },
                { text: 'Give one piece of evidence for that reason.', answer: 'students who do chores learn time management' }
              ]
            }
          ]
        },
        {
          title: 'Counterclaim & Rebuttal',
          intro: 'A strong argument acknowledges the other side and explains why your side is still better.',
          winText: '🎉 You can handle counterclaims!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Address the Other Side',
              blocks: [
                { type: 'text', text: 'A counterclaim is the opposite argument. A rebuttal explains why your argument is still stronger.' },
                { type: 'example', text: 'Counterclaim: Some people say uniforms limit creativity. Rebuttal: However, students can still express themselves through art, writing, and after-school clubs.' },
                { type: 'vocab', word: 'rebuttal', def: 'A response that proves the counterclaim wrong or weak.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Counterclaim or Rebuttal?',
              questions: [
                { q: '"Some people think phones distract students." Counterclaim or rebuttal?', a: 'counterclaim', type: 'text' },
                { q: '"But phones can be turned off during class and used only for research." Counterclaim or rebuttal?', a: 'rebuttal', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Match Counterclaim to Rebuttal',
              mode: 'match',
              pairs: [
                { left: 'Homework takes too much family time.', right: 'However, homework helps students practice skills they learned in class.' },
                { left: 'School uniforms are boring.', right: 'Still, uniforms reduce bullying about clothes.' },
                { left: 'Tests make students anxious.', right: 'Yet, tests help teachers understand what students need to review.' }
              ]
            },
            {
              kind: 'activity',
              title: 'Debate Mission',
              stages: [
                { text: 'Claim: Students should wear uniforms. Write a counterclaim.', answer: 'students should not wear uniforms because' },
                { text: 'Now write a rebuttal to that counterclaim.', answer: 'however uniforms' }
              ]
            }
          ]
        },
        {
          title: 'Full Argumentative Essay',
          intro: 'Put it all together: hook, claim, body paragraphs, counterclaim, and conclusion.',
          winText: '🎉 You wrote an argumentative essay!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Essay Structure',
              blocks: [
                { type: 'text', text: 'An argumentative essay has 5 parts: hook, claim, body paragraphs with reasons and evidence, counterclaim/rebuttal, and conclusion.' },
                { type: 'example', text: 'Hook: Imagine starting school at 9 a.m. and feeling awake. Claim: Schools should start later. Body 1: more sleep. Body 2: better grades. Counterclaim: some say it hurts after-school activities. Rebuttal: schools can adjust practice times. Conclusion: restate claim.' },
                { type: 'tip', text: 'Use formal language. Avoid "I think" or "I feel."' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Essay Parts',
              questions: [
                { q: '"Have you ever felt too tired to learn?" Which essay part?', a: 'hook', type: 'text' },
                { q: '"For these reasons, schools should start later." Which essay part?', a: 'conclusion', type: 'text' },
                { q: '"Some parents disagree..." Which essay part?', a: 'counterclaim', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Order the Essay Parts',
              mode: 'dragSort',
              items: [
                { text: 'Hook the reader', order: 0 },
                { text: 'State your claim', order: 1 },
                { text: 'Give reason 1 + evidence', order: 2 },
                { text: 'Give reason 2 + evidence', order: 3 },
                { text: 'Address counterclaim + rebuttal', order: 4 },
                { text: 'Conclusion', order: 5 }
              ]
            },
            {
              kind: 'activity',
              title: 'Essay Writing Mission',
              stages: [
                { text: 'Prompt: Should students have homework? Write your claim here.', answer: 'students should' },
                { text: 'Write a hook for your essay.', answer: 'have you ever' },
                { text: 'Write one reason with evidence.', answer: 'homework helps' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'English 4: Informative Writing',
      subject: 'ELA',
      lessons: [
        {
          title: 'Informative Essay Basics',
          intro: 'An informative essay teaches the reader about a topic using facts and explanations.',
          winText: '🎉 You can plan an informative essay!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Teach, Don\'t Argue',
              blocks: [
                { type: 'text', text: 'Informative writing explains a topic. It does not try to convince the reader of an opinion.' },
                { type: 'example', text: 'Topic: How do volcanoes erupt? The essay explains the steps using facts.' },
                { type: 'tip', 'text': 'Use a clear topic sentence in each paragraph. Include definitions, examples, and details.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Informative or Argumentative?',
              questions: [
                { q: '"Why Solar Energy Is the Best Choice" — informative or argumentative?', a: 'argumentative', type: 'text' },
                { q: '"How Solar Energy Works" — informative or argumentative?', a: 'informative', type: 'text' },
                { q: '"The Life Cycle of a Butterfly" — informative or argumentative?', a: 'informative', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Match Informative Topic to Focus',
              mode: 'match',
              pairs: [
                { left: 'How to make a sandwich', right: 'Step-by-step instructions' },
                { left: 'The history of video games', right: 'Facts about the past' },
                { left: 'Why exercise matters', right: 'This is actually argumentative' }
              ]
            },
            {
              kind: 'activity',
              title: 'Topic Choice Mission',
              stages: [
                { text: 'Write an informative topic about an animal.', answer: 'how tigers hunt' },
                { text: 'Write an informative topic about a process.', answer: 'how to bake bread' }
              ]
            }
          ]
        },
        {
          title: 'Organizing Information',
          intro: 'Good informative essays are organized so readers can follow the ideas.',
          winText: '🎉 You can organize information!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Patterns of Organization',
              blocks: [
                { type: 'text', text: 'Use compare/contrast, cause/effect, chronological order, or problem/solution to organize your ideas.' },
                { type: 'example', text: 'Chronological: First, the seed grows. Next, the plant flowers. Finally, it produces fruit.' },
                { type: 'example', text: 'Cause/effect: Because students sleep more, they focus better and get higher grades.' },
                { type: 'vocab', word: 'chronological', def: 'In time order, from first to last.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Name the Organization',
              questions: [
                { q: 'An essay compares cats and dogs. Organization?', a: 'compare and contrast', type: 'text' },
                { q: 'An essay tells the steps of making pizza. Organization?', a: 'chronological', type: 'text' },
                { q: 'An essay explains why forests are burning and the results. Organization?', a: 'cause and effect', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Match Topic to Organization',
              mode: 'match',
              pairs: [
                { left: 'The life of Malala Yousafzai', right: 'chronological' },
                { left: 'Online school vs. in-person school', right: 'compare and contrast' },
                { left: 'Pollution and its effects on animals', right: 'cause and effect' }
              ]
            },
            {
              kind: 'activity',
              title: 'Outline Mission',
              stages: [
                { text: 'Choose a topic: "How to Study for a Test." Write the first step.', answer: 'review your notes' },
                { text: 'Write the second step.', answer: 'make flashcards' },
                { text: 'Write the third step.', answer: 'practice with a friend' }
              ]
            }
          ]
        },
        {
          title: 'Introductions & Conclusions',
          intro: 'Hook your reader, introduce the topic, and end with a clear final thought.',
          winText: '🎉 You can open and close essays!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Strong Beginnings and Endings',
              blocks: [
                { type: 'text', text: 'A good introduction gives background and a thesis statement. A good conclusion summarizes and leaves the reader thinking.' },
                { type: 'example', text: 'Topic: Honeybees. Introduction: "Honeybees are small insects that play a huge role in growing our food." Conclusion: "Protecting honeybees helps protect our planet."' },
                { type: 'tip', text: 'Do not add brand new information in the conclusion.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Introduction or Conclusion?',
              questions: [
                { q: '"In this essay, you will learn about the water cycle." Introduction or conclusion?', a: 'introduction', type: 'text' },
                { q: '"Now you understand why the water cycle is important to all life on Earth." Introduction or conclusion?', a: 'conclusion', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Hook Match',
              mode: 'match',
              pairs: [
                { left: 'Topic: space exploration', right: 'Imagine floating in a spaceship, looking down at Earth.' },
                { left: 'Topic: healthy eating', right: 'What if one apple a day could really keep the doctor away?' },
                { left: 'Topic: reading', right: 'Books can take you to places you have never been.' }
              ]
            },
            {
              kind: 'activity',
              title: 'Open and Close Mission',
              stages: [
                { text: 'Write an introduction sentence about the importance of sleep.', answer: 'sleep is important because' },
                { text: 'Write a conclusion sentence about the same topic.', answer: 'getting enough sleep helps' }
              ]
            }
          ]
        },
        {
          title: 'Full Informative Essay',
          intro: 'Write a complete informative essay with all the parts.',
          winText: '🎉 You wrote an informative essay!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'From Outline to Essay',
              blocks: [
                { type: 'text', text: 'Start with an outline: introduction, body paragraphs, conclusion. Then expand each section with details.' },
                { type: 'example', text: 'Topic: How to Grow a Garden. Introduction: why gardens are useful. Body 1: choosing seeds. Body 2: watering and sunlight. Body 3: harvesting. Conclusion: benefits of gardening.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Plan the Essay',
              questions: [
                { q: 'How many body paragraphs should a short informative essay have?', a: '2 or 3', type: 'text' },
                { q: 'What does the introduction need besides a hook?', a: 'thesis or topic statement', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Essay Part Sort',
              mode: 'categorize',
              categories: ['Introduction', 'Body', 'Conclusion'],
              items: [
                { text: 'Background information about the topic', category: 'Introduction' },
                { text: 'A fact that explains one part of the topic', category: 'Body' },
                { text: 'A final sentence that wraps up the essay', category: 'Conclusion' },
                { text: 'Thesis statement', category: 'Introduction' }
              ]
            },
            {
              kind: 'activity',
              title: 'Informative Essay Mission',
              stages: [
                { text: 'Choose a topic and write your title.', answer: 'how to' },
                { text: 'Write your thesis statement.', answer: 'this essay will explain' },
                { text: 'Write one body paragraph topic sentence.', answer: 'the first step is' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'English 5: Language, Vocabulary & Stories',
      subject: 'ELA',
      lessons: [
        {
          title: 'Sentence Variety',
          intro: 'Good writers use different sentence types to make their writing interesting.',
          winText: '🎉 You can vary your sentences!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Simple, Compound, Complex',
              blocks: [
                { type: 'text', text: 'Simple sentence: one independent clause. Compound: two clauses joined with a conjunction. Complex: one independent clause + one dependent clause.' },
                { type: 'example', text: 'Simple: The cat slept. Compound: The cat slept, and the dog barked. Complex: The cat slept because it was tired.' },
                { type: 'vocab', word: 'clause', def: 'A group of words with a subject and a verb.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Name the Sentence Type',
              questions: [
                { q: '"I ran, but he walked." Type?', a: 'compound', type: 'text' },
                { q: '"Although it rained, we played outside." Type?', a: 'complex', type: 'text' },
                { q: '"She sings." Type?', a: 'simple', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Sentence Match',
              mode: 'match',
              pairs: [
                { left: 'The dog barked loudly.', right: 'simple' },
                { left: 'The dog barked, and the cat ran.', right: 'compound' },
                { left: 'When the dog barked, the cat ran.', right: 'complex' }
              ]
            },
            {
              kind: 'activity',
              title: 'Sentence Builder Mission',
              stages: [
                { text: 'Write a compound sentence about school.', answer: 'school is fun and' },
                { text: 'Write a complex sentence starting with "Because."', answer: 'because i studied' }
              ]
            }
          ]
        },
        {
          title: 'Greek & Latin Roots',
          intro: 'Many English words come from Greek and Latin roots. Learn the roots to unlock new words.',
          winText: '🎉 You unlocked new words!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Word Parts',
              blocks: [
                { type: 'text', text: 'A root is the core meaning of a word. Prefixes and suffixes change the word.' },
                { type: 'example', text: 'Root "spect" means see. Inspect = look into. Spectator = one who watches.' },
                { type: 'example', text: 'Root "port" means carry. Transport = carry across. Export = carry out.' },
                { type: 'vocab', word: 'prefix', def: 'A group of letters added to the beginning of a word.' },
                { type: 'vocab', word: 'suffix', def: 'A group of letters added to the end of a word.' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Root Meaning',
              questions: [
                { q: 'What does "port" mean?', a: 'carry', type: 'text' },
                { q: 'What does "struct" mean?', a: 'build', type: 'text' },
                { q: 'What does "dict" mean?', a: 'say', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Root Match',
              mode: 'match',
              pairs: [
                { left: 'transport', right: 'carry across' },
                { left: 'construction', right: 'the act of building' },
                { left: 'predict', right: 'say before' },
                { left: 'audience', right: 'people who hear' }
              ]
            },
            {
              kind: 'activity',
              title: 'Word Detective Mission',
              stages: [
                { text: 'Break apart "unhappy." What is the prefix and root?', answer: 'un and happy' },
                { text: 'Break apart "impossible." What is the prefix and root?', answer: 'im and possible' }
              ]
            }
          ]
        },
        {
          title: 'Figurative Language',
          intro: 'Writers use comparisons and special words to create pictures and feelings.',
          winText: '🎉 You spotted figurative language!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Similes, Metaphors, Personification',
              blocks: [
                { type: 'text', text: 'Simile uses "like" or "as." Metaphor says one thing is another. Personification gives human traits to non-human things.' },
                { type: 'example', text: 'Simile: "Her smile was like sunshine." Metaphor: "Time is a thief." Personification: "The wind whispered through the trees."' },
                { type: 'vocab', word: 'metaphor', def: 'A comparison without using "like" or "as."' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Name the Figurative Language',
              questions: [
                { q: '"The classroom was a zoo." Simile, metaphor, or personification?', a: 'metaphor', type: 'text' },
                { q: '"The stars winked in the sky." Simile, metaphor, or personification?', a: 'personification', type: 'text' },
                { q: '"He runs as fast as a cheetah." Simile, metaphor, or personification?', a: 'simile', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Figurative Match',
              mode: 'match',
              pairs: [
                { left: 'Her voice was music to my ears.', right: 'metaphor' },
                { left: 'The old car groaned up the hill.', right: 'personification' },
                { left: 'He is as brave as a lion.', right: 'simile' }
              ]
            },
            {
              kind: 'activity',
              title: 'Poet Mission',
              stages: [
                { text: 'Write a simile about the ocean.', answer: 'the ocean is like' },
                { text: 'Write a personification about a clock.', answer: 'the clock' }
              ]
            }
          ]
        },
        {
          title: 'Narrative Writing',
          intro: 'Tell a story with characters, setting, conflict, and resolution.',
          winText: '🎉 You planned a story!',
          tags: ['ELA'],
          phases: [
            {
              kind: 'lesson',
              subject: 'ELA',
              title: 'Story Elements',
              blocks: [
                { type: 'text', text: 'A narrative has characters, setting, plot, conflict, and resolution. Use sensory details and dialogue.' },
                { type: 'example', text: 'Plot: A girl loses her dog (conflict), searches the neighborhood (rising action), finds him at the park (climax), and brings him home (resolution).' },
                { type: 'tip', text: 'Show, don\'t tell. Instead of "She was scared," write "Her hands shook and her heart raced."' }
              ]
            },
            {
              kind: 'drill',
              subject: 'ELA',
              title: 'Story Part',
              questions: [
                { q: '"The problem the character faces." Which story part?', a: 'conflict', type: 'text' },
                { q: '"Where and when the story happens." Which story part?', a: 'setting', type: 'text' },
                { q: '"The most exciting moment." Which story part?', a: 'climax', type: 'text' }
              ]
            },
            {
              kind: 'practice',
              subject: 'ELA',
              title: 'Story Map Match',
              mode: 'match',
              pairs: [
                { left: 'Character', right: 'The person or animal in the story' },
                { left: 'Setting', right: 'Where the story takes place' },
                { left: 'Resolution', right: 'How the problem is solved' }
              ]
            },
            {
              kind: 'activity',
              title: 'Story Starter Mission',
              stages: [
                { text: 'Write the first sentence of a story about a lost key.', answer: 'one morning' },
                { text: 'Describe the setting in one sentence.', answer: 'the sun shone' },
                { text: 'What is the conflict?', answer: 'the key was missing' }
              ]
            }
          ]
        }
      ]
    }
  ]
};
