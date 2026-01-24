import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Cryptographic Rigor',
    description: (
      <>
        Built with high cryptographic standards for managing zero-knowledge proof
        ceremonies and trusted setup processes.
      </>
    ),
  },
  {
    title: 'Complete API',
    description: (
      <>
        Comprehensive REST API for managing ceremonies, participants, circuits,
        and contributions with full TypeScript type safety.
      </>
    ),
  },
  {
    title: 'Docs as Code',
    description: (
      <>
        Documentation generated directly from source code with TypeDoc, ensuring
        accuracy and consistency with the codebase.
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
