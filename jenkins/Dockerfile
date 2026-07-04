FROM jenkins/jenkins:lts

USER root

# Install Git, Docker CLI, curl
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    docker.io \
    ca-certificates \
    gnupg

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/v1.36.1/bin/linux/amd64/kubectl" && \
    install -m 0755 kubectl /usr/local/bin/kubectl && \
    rm kubectl

# Give Jenkins access to Docker socket
RUN usermod -aG docker jenkins

USER jenkins