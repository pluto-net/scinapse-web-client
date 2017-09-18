jest.unmock("../abstract");

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import Abstract, { IAbstractProps } from "../abstract";

describe("<Abstract /> component", () => {
  let abstractWrapper: ShallowWrapper<IAbstractProps>;
  const mockContent = `Reproducibility, data sharing, personal data privacy concerns and patient enrolment in clinical trials are huge medical challenges for contemporary clinical research. A new technology, Blockchain, may be a key to addressing these challenges and should draw the attention of the whole clinical research community.

  Blockchain brings the Internet to its definitive decentralisation goal. The core principle of Blockchain is that any service relying on trusted third parties can be built in a transparent, decentralised, secure "trustless" manner at the top of the Blockchain (in fact, there is trust, but it is hardcoded in the Blockchain protocol via a complex cryptographic algorithm). Therefore, users have a high degree of control over and autonomy and trust of the data and its integrity. Blockchain allows for reaching a substantial level of historicity and inviolability of data for the whole document flow in a clinical trial. Hence, it ensures traceability, prevents a posteriori reconstruction and allows for securely automating the clinical trial through what are called Smart Contracts. At the same time, the technology ensures fine-grained control of the data, its security and its shareable parameters, for a single patient or group of patients or clinical trial stakeholders.

  In this commentary article, we explore the core functionalities of Blockchain applied to clinical trials and we illustrate concretely its general principle in the context of consent to a trial protocol. Trying to figure out the potential impact of Blockchain implementations in the setting of clinical trials will shed new light on how modern clinical trial methods could evolve and benefit from Blockchain technologies in order to tackle the aforementioned challenges.`;

  beforeEach(() => {
    abstractWrapper = shallow(<Abstract content={mockContent} />);
  });

  it("should match snapshot", () => {
    expect(abstractWrapper.html()).toMatchSnapshot();
  });
});
