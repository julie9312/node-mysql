const connection = require('./mysql_connection.js')

let query = 'select * from reviewers'

// query = 'select s.title, r.rating from series as s join reviews as r on s.id = r.series_id;'

// query = 'select s.title, avg(r.rating) as avg_rating \
// from reviews as r join series as s \
// on s.id = r.series_id group by s.title order by r.rating;'

// query = 'select rv.first_name, rv.last_name, r.rating \
// from reviewers as rv join reviews as r on rv.id = r.reviewer_id;'

// // query = 'select title as unreviewed_series
// from series as s
// left join reviews as r
// on s.id = r.series_id
// where r.rating is null;'

// // query = 'select genre, avg(rating) as avg_rating
// from series as s  
// join reviews as r
// on r.series_id = s.id
// group by s.genre;'

// // query = 'select first_name, last_name, count(rating) as count,
// min(rating) as min, max(rating) as max, avg(rating) as avg,
// case(rating)
// when count(rating) > 0 then "ACTIVE"
// else "INACTIVE"
// end as status
// from reviewers as rv
// left join reviews as r 
// on r.reviewer_id = rv.id
// group by rv.id;'

// // query = 'select title, rating, concat(first_name," ",last_name) as reviewer
// from series as s
// join reviews as r
// on s.id = r.series_id
// join reviewers as rv
// on r.reviewer_id = rv.id
// order by s.title;
// '

connection.query(query, function(error, results, fields){

    console.log(results)
})

connection.end()





