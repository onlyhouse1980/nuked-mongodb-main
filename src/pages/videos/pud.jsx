import { Suspense } from 'react'
import VideoComponent from '../../components/PUDVideoComponent.jsx'
 
export default function Page() {
  return (
    <section>
      <Suspense fallback={<p>Loading video...</p>}>
        <VideoComponent />
      </Suspense>
      {/* Other content of the page */}
    </section>
  )
}
