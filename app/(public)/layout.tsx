import Footer from "@/components/Footer"
import Header from "@/components/Header"

function layout({children}:{children:React.ReactNode}) {
  return (
    <div>
<Header/>

{children}

<Footer />
    </div>
  )
}

export default layout