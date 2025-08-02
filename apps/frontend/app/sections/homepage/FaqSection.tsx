import Image from "next/image";
import { Accordion } from "@/app/components/ui/Accordion";
import { AppContent } from "@/app/components/layouts/AppContent";

const faqContentItems = [
  {
    title: "Why do we need an MPC Phase 2 Trusted Setup ceremony?",
    content:
      "MPC Phase 2 Trusted Setup ceremonies are necessary for ensuring the security and privacy of cryptographic protocols that require zero-knowledge proofs. These ceremonies are used to generate the initial parameters for the zero-knowledge proof system, which must be securely and randomly generated to prevent any backdoors or biases from being introduced. Without a secure and trustworthy setup, the entire protocol could be compromised, leading to serious security vulnerabilities and potential breaches.",
  },
  {
    title: "What makes an MPC Trusted Setup ceremony secure?",
    content:
      "MPC Trusted Setup ceremonies can be made secure through a variety of measures, including multi-party computation, randomization, and transparency. In an MPC ceremony, participants work together to generate the initial parameters for the zero-knowledge proof system, ensuring that no one individual has complete control over the process. Additionally, the use of randomization helps to ensure that the generated parameters are unbiased and cannot be predicted in advance. Transparency plays a critical role for ensuring that the ceremony is conducted fairly and that all participants can verify the integrity of the generated parameters.",
  },
  {
    title: "What is the difference between Phase 1 and Phase 2 Trusted Setup?",
    content:
      `The **Phase 1** is universally reusable in any point of contribution as input for any zkSNARKs Phase 2. Briefly, the goal of the Phase 1 is to securely generate zk-SNARK parameters for circuits of up to a huge amount of constraints. For example, the [Perpetual Powers of Tau Phase 1 Ceremony](https://github.com/weijiekoh/perpetualpowersoftau) conducted by people from the EF, generated zkSNARK parameters up to 2 ^ 28 (260+ million) constraints. This means that the process will generate twice as many minus one (530+ million) powers of tau (pretty suitable for every zkSNARK circuit out of there). The **Phase 2** is a circuit-specific ceremony. Therefore, the Phase 2 must be don for each individual circuit. At the end of the ceremony or at a certain point in time, the last contribution (.zkey file) will be used for extracting the verification key and everything will be ready for proofs generation and verification!`,
  },
  {
    title: "What exactly happens during a ceremony?",
    content:
      "During a Trusted Setup ceremony, a group of participants work together to generate the initial parameters for a zero-knowledge proof system. The process typically involves multiple rounds, with each participant contributing some entropy to the system and passing the results to the next participant. The goal is to generate a set of parameters that are random, unbiased, and unpredictable, with no one individual having complete control over the process. The ceremony may be conducted using multi-party computation techniques to ensure fairness and transparency.",
  },
  {
    title: "What is the output of a ceremony? How could we trust it?",
    content:
      "The output of a Trusted Setup ceremony is a set of parameters that are used to generate zero-knowledge proofs for a specific protocol or application. To trust the output, it is important to ensure that the ceremony was conducted fairly and that no backdoors or biases were introduced into the parameters. This may involve auditing the process, using multi-party computation techniques to ensure transparency, and relying on the reputation and trustworthiness of the participants involved. Additionally, the parameters may undergo further testing and verification to ensure their security and validity.",
  },
  {
    title: "What is p0tion?",
    content:
      "p0tion is a project (formerly known as MPC Phase 2 Suite) from MACI/QFI team from PSE. You could think p0tion as a toolkit for making effortless running Trusted Setup Phase 2 ceremonies for multiple circuit at the same time. Making one of these MPC protocols requires time and development resources for design, auditing, testing, security, operations, ceremony conduction plan, guides and so on. That’s why we are working toward p0tion to be an agnostic-from-ceremony public good toolkit, usable by everyone, to  make their Groth16 zk-applications scale and safely production-ready by running their Phase 2 Trusted Setup ceremonies.",
  },
  {
    title: "How do people know that their contribution has been included?",
    content:
      "During the contribution verification process, a transcript file containing the hashes of all contributions prior to the current one is released. In this way, each participant can verify that the hash of his or her locally produced contribution matches within the transcript. In addition, p0tion automatically goes on to create a public attestation for each participant containing the hashes of his or her contributions, which is then published as a Github Gist leveraging the Github APIs (via the authentication token saved locally on the participant's machine-no server side comms).",
  },
  {
    title: `How does "wrong contribution" detection work?`,
    content:
      "Verification of a contribution occurs automatically at the request of the participant (who must match particular conditions) upon completion of the calculation and upload of his or her contribution. The verification, should it go negative, would go to update the database (Firestore) and remove the erroneous contribution from storage (S3). In this way, the contribution is prevented from being included in the chain of contributions and used for the calculation of the next contribution.",
  },
  {
    title: "Is there a maximum time to make the contribution?",
    content:
      "Each coordinator is free to choose the maximum time amount each participant has to execute a contribution. To avoid blocking situations in terms of waiting queue to calculate a contribution, this time amount is coded as a timeout. Each coordinator can choose whether to use a fixed or dynamic timeout. This time amount is total for the download, computation of the new contribution, and upload operations. It does not include the verification part which turns out to have a separate timeout (60 minutes) since there is a limitation by the Cloud Function. In any case, the coordinator can also choose the penalty for each individual circuit once the timeout is triggered for a participant at ceremony setup.",
  },
];


export const FaqSection = () => {
  return (
    <section className="bg-yellow">
      <AppContent className="py-[120px]">
        <div className="grid grid-cols-[320px_600px] gap-10 w-full justify-between">
          <div className="flex flex-col gap-11">
            <h3 className="text-black text-6xl leading-[66px] font-medium">
              Frequently asked questi0ns
            </h3>
            <Image
              src="/icons/spiral.svg"
              alt="faq"
              width={248}
              height={280}
            />
          </div>
          <Accordion items={faqContentItems} />
        </div>
      </AppContent>
    </section>
  );
};
