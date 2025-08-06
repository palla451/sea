import { inject, Injectable } from "@angular/core";
import { CyberProduct } from "../models/cyber-product.models";
import { ApiService } from "../../../core/services/api.service";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RetrieveCyberProductsService {
  private mockedCyberProducts: CyberProduct[] = [
    {
      id: "1",
      name: "Wazuh",
      image: "Wazuh.svg",
      description:
        "Wazuh was selected for the SIEM module because it offers a comprehensive and scalable open-source solution for security event collection, correlation, and analysis. Built on a customized version of Amazon OpenSearch, it provides powerful capabilities for real-time threat detection while ensuring flexibility and adaptability to complex environments like naval systems. Its integration-friendly architecture and native support for features such as File Integrity Monitoring (FIM) and custom decoder development make it well-suited for handling diverse data sources, including EDR, IDS, and OT security components.The decision to separate functional layers within the cybersecurity architecture—including the separation between the Log Collector and the SIEM, despite their close technological relationship—was driven by key architectural and operational considerations. First and foremost, this separation promotes a clear decoupling of responsibilities: the Log Collector focuses solely on ingesting, parsing, and forwarding raw logs from onboard systems, while the SIEM is dedicated to correlation, analysis, and threat detection. By isolating these roles, each component can be optimized independently in terms of performance, scalability, and security. From a cybersecurity perspective, this modular approach enhances system resilience. In the event of a compromise or failure in one module, the other can continue functioning with minimal disruption. It also simplifies maintenance and troubleshooting, allowing updates or reconfigurations to be applied to one component without impacting the other. Furthermore, separating the Log Collector from the SIEM supports better resource allocation and tuning. Log parsing and ingestion are often resource-intensive and require different processing logic than the correlation and alerting tasks performed by the SIEM. Keeping them distinct ensures that neither process starves the other of critical resources. Finally, this architectural choice allows for greater flexibility and future scalability. As system complexity grows or integration needs evolve (e.g., with additional onboard subsystems or external analysis platforms), having distinct, well-defined layers allows for easier adaptation and extension of the overall cybersecurity solution.",
      link: "https://wazuh-dashboard.ship.mcsp.dev.fde.local",
    },
    {
      id: "2",
      name: "Shuffle",
      image: "shuffle.svg",
      description:
        "The Shuffle platform was chosen as the engine for the SOAR module because it is an open-source solution that provides a flexible, lightweight, and highly customizable framework for automating and orchestrating incident response processes. Its open nature allows for deep integration with the existing architecture, including the Amazon OpenSearch data lake deployed at the edge. This ensures consistency in data handling and enables seamless interaction between the SOAR engine and other onboard cybersecurity systems. Moreover, Shuffle supports the development and execution of custom playbooks and plugins, making it ideal for addressing the specific operational needs of the naval environment. In this implementation, Shuffle will manage playbooks triggered by the Case Manager, enabling operator-driven, yet automated, responses to security incidents. The solution also supports structured status tracking for up to 20 different classes of OT/IT devices, ensuring comprehensive situational awareness and response coordination across diverse asset types. The choice of Shuffle reflects the need for a modular, extensible, and interoperable SOAR engine capable of evolving with the complexity of onboard systems while maintaining operational efficiency and rapid threat response capabilities.",
      link: "https://shuffle-dashboard.ship.mcsp.dev.fde.local",
    },
    // {
    //   id: "3",
    //   name: "Fortinet",
    //   image: "fortinet.svg",
    //   description:
    //     "For the Tuning & Hardening module, NeuVector and Fortinet were selected as the primary tools due to their specialized capabilities in optimizing configurations and enhancing the security of onboard systems. NeuVector was chosen for its robust features in OS hardening and network segmentation for VMs and containers, while Fortinet was selected for its advanced network segmentation capabilities, which are crucial for securing the MCSP. These tools allow for the efficient reduction of vulnerabilities and false positives, as well as the enforcement of industry standards such as IACS, NIST, CIS, and NAV50, ultimately contributing to a more resilient cybersecurity architecture. In addition, MCSP must be able to operate in context with or without FDP, for communication needs during the navigation; however, when FDP is present, communication with external cloud must be pass through FDP. MCSP can send (e.g. historical alerts) or receive (e.g. asset inventory or remote remediations) data from FDP; When FDP is not available NACYSE access to cloud will be direct",
    //   link: "https://fw-sdwan.fde.local",
    // },
    {
      id: "3",
      name: "Keycloak",
      image: "keycloak.svg",
      description:
        "Keycloak was selected for the IAM module because it is a mature, open-source identity and access management solution that provides robust authentication and authorization capabilities out of the box. Its support for local credential management aligns with the scope of Release 1.0, which excludes integration and synchronization with the FDP. Keycloak allows for fine-grained access control, user role management, and secure login flows, making it well-suited to enforce strict access policies across onboard systems. Its flexibility and ease of configuration also support rapid deployment within the constraints of the initial release.",
      link: "https://iam.ship.dev.fde.local/",
    },
    {
      id: "4",
      name: "APISIX",
      image: "apisix.svg",
      description:
        "APISIX API Gateway provides rich traffic management features like load balancing, dynamic upstream, canary release, circuit breaking, auth, and observability.",
      link: "https://admin-api.ship.mcsp.dev.fde.local/",
    },
    // {
    //   id: "6",
    //   name: "NeuVector",
    //   image: "neuVector.svg",
    //   description:
    //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
    //   link: "https://kubeconsole.dev.fde.local/k8s/clusters/c-m-pwp786sz/api/v1/namespaces/cattle-neuvector-system/services/https:neuvector-service-webui:8443/proxy ",
    // },
    // {
    //   id: "7",
    //   name: "Zabbix",
    //   image: "zabbix.svg",
    //   description:
    //     "Zabbix was chosen for the APM module, for its flexibility, ease of integration with the existing infrastructure, and powerful monitoring capabilities, which make it an ideal solution for meeting the performance and health requirements of onboard systems in a scalable and customizable manner. Zabbix offers seamless integration with the current infrastructure, including remote channels like SSH and APIs, allowing for efficient monitoring of both virtual machines and containerized environments. Its extensive monitoring features—ranging from CPU, memory, and response times to custom thresholds—enable precise control over system performance. Furthermore, Zabbix's scalability ensures that it can effectively manage both small and large deployments, making it a robust choice for the varied and evolving needs of the onboard systems. This combination of flexibility, scalability, and deep monitoring functionality makes Zabbix the right tool to ensure the continuous, reliable performance of the onboard systems.",
    //   link: "https://www.zabbix.com/",
    // },
  ];

  //endpoint to be defined yet
  private API_URL = "/cyber-products/";

  apiService = inject(ApiService);

  getCyberProducts(): Observable<CyberProduct[]> {
    return of(this.mockedCyberProducts);
    //return this.apiService.get(this.API_URL);
  }
}
