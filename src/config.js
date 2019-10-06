module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 8000,
    DATABASE_URL: 'postgres://svyxjkjrjbjxrf:06e134c51460f2f4bf791561bc68c776cc4e719fe3ba06dee74a151c1bfade70@ec2-54-235-100-99.compute-1.amazonaws.com:5432/d7e9bm5n9p2mja' || 'postgresql://dunder-mifflin@localhost/noteful',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://dunder-mifflin@localhost/noteful-test',
}