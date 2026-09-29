import { useState } from 'react'

function Reviews({ imdbId, reviewIds }) {

  const [reviewBody, setReviewBody] = useState('')
  const [message, setMessage] = useState('')
  const [reviews, setReviews] = useState(reviewIds || [])
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!reviewBody.trim()) {
      setMessage('Please enter a review.')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:8080/api/v1/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewBody: reviewBody,
          imdbId: imdbId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit review')
      }

      const data = await response.json()

      setReviews(prevReviews => [...prevReviews, data])
      setReviewBody('')
      setMessage('Review submitted successfully!')

    } catch (error) {
      console.error(error)
      setMessage('Failed to submit review.')

    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="reviews">

      <h2>Reviews ({reviews.length})</h2>

      {/* Existing Reviews */}
      {reviews && reviews.length > 0 ? (

        <div className="review-list">

          {reviews.map((review, index) => (

            <div
              className="review-card"
              key={index}
            >
              <p>{review.body}</p>
            </div>

          ))}

        </div>

      ) : (

        <p>No reviews yet.</p>

      )}

      {/* Add New Review */}
      <form onSubmit={handleSubmit}>

        <textarea
          value={reviewBody}
          onChange={(event) => setReviewBody(event.target.value)}
          placeholder="Write your review..."
          rows="5"
          maxLength={500}
        />

        <p
          className={
            reviewBody.length >= 450
              ? 'character-count character-count-warning'
              : 'character-count'
          }
        >
          {reviewBody.length}/500 characters
        </p>

        <button
          type="submit"
          disabled={submitting || !reviewBody.trim()}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>

      </form>

      {message && <p>{message}</p>}

    </section>
  )
}

export default Reviews