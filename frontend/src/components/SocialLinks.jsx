import { FaYoutube, FaInstagram, FaSoundcloud, FaBandcamp, FaXTwitter } from 'react-icons/fa6'

const iconMap = {
  youtube: FaYoutube,
  instagram: FaInstagram,
  soundcloud: FaSoundcloud,
  bandcamp: FaBandcamp,
  x: FaXTwitter
}

const SocialLinks = ({ socials }) => {
  if (!socials) return null

  return (
    <div className="social-links" style={{ display: 'flex'}}>
      {Object.entries(socials).map(([key, url]) => {
        const Icon = iconMap[key]
        if (!url) return null
        return (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" style={{ margin: '10px' }}>
            {Icon ? <Icon size={20} /> : key}
          </a>
        )
      })}
    </div>
  )
}

export default SocialLinks
