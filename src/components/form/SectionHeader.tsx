import styles from './index.less'

export default function SectionHeader({ title = '' }) {
  return (
    <div className={styles.sectionHeader} >{title}</div>
  )
}
